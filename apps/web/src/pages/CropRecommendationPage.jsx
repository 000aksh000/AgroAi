import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Wheat,
  Sparkles,
  Tractor,
  CloudSun,
  AlertCircle,
  TrendingUp,
  Droplets,
  Layers,
  History,
  CheckCircle2
} from "lucide-react";
import { useFarm } from "../context/FarmContext";
import { apiClient } from "../api/client";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

export const CropRecommendationPage = () => {
  const { selectedFarm } = useFarm();
  const [form, setForm] = useState({
    nitrogen: 80,
    phosphorus: 45,
    potassium: 40,
    soilPh: 6.5,
    temperature: 25,
    humidity: 75,
    rainfall: 180,
    season: "Kharif",
    state: "Maharashtra",
    district: "Nashik"
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedFarm) {
      setForm((prev) => ({
        ...prev,
        nitrogen: selectedFarm.nitrogen ?? prev.nitrogen,
        phosphorus: selectedFarm.phosphorus ?? prev.phosphorus,
        potassium: selectedFarm.potassium ?? prev.potassium,
        soilPh: selectedFarm.soilPh ?? prev.soilPh,
        state: selectedFarm.state || prev.state,
        district: selectedFarm.district || prev.district,
        season: selectedFarm.currentSeason || prev.season
      }));
    }
  }, [selectedFarm]);

  const { data: liveWeather, refetch: refetchWeather } = useQuery({
    queryKey: ["crop-weather-sync", form.district],
    queryFn: async () => {
      const res = await apiClient.get("/weather", { params: { city: form.district || "Pune" } });
      return res.data.data;
    },
    enabled: false
  });

  const handleAutoFillWeather = async () => {
    const { data } = await refetchWeather();
    if (data?.current) {
      const rain = data.forecast?.[0]?.precipitationSum || 15;
      setForm((prev) => ({
        ...prev,
        temperature: Math.round(data.current.temperature),
        humidity: Math.round(data.current.humidity),
        rainfall: Math.round(rain * 10)
      }));
    }
  };

  const recommendMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        farmId: selectedFarm?.id,
        nitrogen: Number(form.nitrogen),
        phosphorus: Number(form.phosphorus),
        potassium: Number(form.potassium),
        soilPh: Number(form.soilPh),
        temperature: Number(form.temperature),
        humidity: Number(form.humidity),
        rainfall: Number(form.rainfall),
        state: form.state,
        district: form.district,
        season: form.season
      };
      const res = await apiClient.post("/crops/recommend", payload);
      return res.data.data.result;
    },
    onSuccess: (data) => {
      setResult(data);
      setError(null);
      window.scrollTo({ top: 400, behavior: "smooth" });
    },
    onError: (err) => {
      setError(
        err.response?.data?.error?.message ||
          "Failed to run crop recommendation. Please check inputs and ensure ML service is running."
      );
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#2D3B30]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-[#F0EBDD] tracking-tight">
              Soil Nutrient & Crop Intelligence Engine
            </h1>
            <Badge variant="gold" size="sm">
              Botanical ML Model
            </Badge>
          </div>
          <p className="text-xs text-[#A5AA96] mt-1 font-medium">
            Calibrate suitable crops based on soil nutrient chemistry (NPK, pH) and micro-climate patterns.
          </p>
        </div>

        <Link to="/history">
          <Button variant="outline" size="sm" icon={<History className="w-4 h-4 text-[#D4BE8D]" />}>
            Historical Analyses
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#2D3B30] mb-4">
              <span className="text-xs font-serif font-bold text-[#D4BE8D] uppercase tracking-wider">
                Agronomic Parameters
              </span>
              <div className="flex gap-2">
                {selectedFarm && (
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        nitrogen: selectedFarm.nitrogen ?? prev.nitrogen,
                        phosphorus: selectedFarm.phosphorus ?? prev.phosphorus,
                        potassium: selectedFarm.potassium ?? prev.potassium,
                        soilPh: selectedFarm.soilPh ?? prev.soilPh
                      }));
                    }}
                    className="text-[11px] font-semibold text-[#D4BE8D] hover:text-[#F0EBDD] bg-[#18251D] border border-[#B69A62]/30 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-subtle"
                    title="Populate from active farm"
                  >
                    <Tractor className="w-3 h-3 text-[#B69A62]" />
                    Fill Farm NPK
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleAutoFillWeather}
                  className="text-[11px] font-semibold text-[#A4D5A4] hover:text-[#F0EBDD] bg-[#18251D] border border-[#71805A]/40 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-subtle"
                  title="Populate from live weather"
                >
                  <CloudSun className="w-3 h-3 text-[#71805A]" />
                  Fill Weather
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-[#8B2E2E]/25 border border-[#8B2E2E]/50 text-[#FCA5A5] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                recommendMutation.mutate();
              }}
              className="space-y-4"
            >
              {/* Soil Nutrients */}
              <div className="p-4 rounded-xl bg-[#18251D] border border-[#2D3B30] space-y-3">
                <span className="text-xs font-serif font-bold text-[#F0EBDD] block">
                  Soil Chemistry (Soil Health Card)
                </span>

                <div className="grid grid-cols-3 gap-2.5 text-xs">
                  <div>
                    <label className="block text-[11px] font-medium text-[#A5AA96] mb-1">
                      Nitrogen (N)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="300"
                        required
                        value={form.nitrogen}
                        onChange={(e) =>
                          setForm({ ...form, nitrogen: parseInt(e.target.value, 10) || 0 })
                        }
                        className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#2D3B30] focus:outline-none focus:ring-2 focus:ring-[#B69A62] bg-[#101B16] font-mono font-bold text-[#F0EBDD]"
                      />
                      <span className="text-[10px] text-[#A5AA96] block mt-0.5">kg/ha</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#A5AA96] mb-1">
                      Phosphorus (P)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="200"
                        required
                        value={form.phosphorus}
                        onChange={(e) =>
                          setForm({ ...form, phosphorus: parseInt(e.target.value, 10) || 0 })
                        }
                        className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#2D3B30] focus:outline-none focus:ring-2 focus:ring-[#B69A62] bg-[#101B16] font-mono font-bold text-[#F0EBDD]"
                      />
                      <span className="text-[10px] text-[#A5AA96] block mt-0.5">kg/ha</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#A5AA96] mb-1">
                      Potassium (K)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="300"
                        required
                        value={form.potassium}
                        onChange={(e) =>
                          setForm({ ...form, potassium: parseInt(e.target.value, 10) || 0 })
                        }
                        className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#2D3B30] focus:outline-none focus:ring-2 focus:ring-[#B69A62] bg-[#101B16] font-mono font-bold text-[#F0EBDD]"
                      />
                      <span className="text-[10px] text-[#A5AA96] block mt-0.5">kg/ha</span>
                    </div>
                  </div>
                </div>

                <div className="pt-1">
                  <div className="flex justify-between text-[11px] mb-1">
                    <label className="font-medium text-[#A5AA96]">Soil pH Reaction</label>
                    <span className="font-mono font-bold text-[#D4BE8D]">{form.soilPh}</span>
                  </div>
                  <input
                    type="range"
                    min="3.5"
                    max="9.5"
                    step="0.1"
                    value={form.soilPh}
                    onChange={(e) => setForm({ ...form, soilPh: parseFloat(e.target.value) })}
                    className="w-full accent-[#B69A62] cursor-pointer"
                  />
                </div>
              </div>

              {/* Climate & Weather */}
              <div className="p-4 rounded-xl bg-[#18251D] border border-[#2D3B30] space-y-3">
                <span className="text-xs font-serif font-bold text-[#F0EBDD] block">
                  Meteorological Environment
                </span>

                <div className="grid grid-cols-3 gap-2.5 text-xs">
                  <div>
                    <label className="block text-[11px] font-medium text-[#A5AA96] mb-1">
                      Temp (°C)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="55"
                      required
                      value={form.temperature}
                      onChange={(e) =>
                        setForm({ ...form, temperature: parseInt(e.target.value, 10) || 0 })
                      }
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#2D3B30] focus:outline-none focus:ring-2 focus:ring-[#B69A62] bg-[#101B16] font-mono font-bold text-[#F0EBDD]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#A5AA96] mb-1">
                      Humidity (%)
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="100"
                      required
                      value={form.humidity}
                      onChange={(e) =>
                        setForm({ ...form, humidity: parseInt(e.target.value, 10) || 0 })
                      }
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#2D3B30] focus:outline-none focus:ring-2 focus:ring-[#B69A62] bg-[#101B16] font-mono font-bold text-[#F0EBDD]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#A5AA96] mb-1">
                      Rainfall (mm)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="500"
                      required
                      value={form.rainfall}
                      onChange={(e) =>
                        setForm({ ...form, rainfall: parseInt(e.target.value, 10) || 0 })
                      }
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#2D3B30] focus:outline-none focus:ring-2 focus:ring-[#B69A62] bg-[#101B16] font-mono font-bold text-[#F0EBDD]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <label className="block text-[11px] font-medium text-[#A5AA96] mb-1">Season</label>
                    <select
                      value={form.season}
                      onChange={(e) => setForm({ ...form, season: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#2D3B30] focus:outline-none focus:ring-2 focus:ring-[#B69A62] bg-[#101B16] text-[#F0EBDD] font-medium cursor-pointer"
                    >
                      <option value="Kharif">Kharif (Monsoon)</option>
                      <option value="Rabi">Rabi (Winter)</option>
                      <option value="Zaid">Zaid (Summer)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#A5AA96] mb-1">District</label>
                    <input
                      type="text"
                      placeholder="e.g. Nashik"
                      value={form.district}
                      onChange={(e) => setForm({ ...form, district: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#2D3B30] focus:outline-none focus:ring-2 focus:ring-[#B69A62] bg-[#101B16] text-[#F0EBDD]"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                isLoading={recommendMutation.isPending}
                className="w-full bg-[#294C36] hover:bg-[#346045] text-[#F0EBDD] border border-[#B69A62]/40 shadow-subtle hover:shadow-gold-glow"
                icon={<Sparkles className="w-4 h-4 text-[#D4BE8D]" />}
              >
                Compute Crop Recommendation
              </Button>
            </form>
          </Card>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
              {/* Primary Crop Card */}
              <Card className="border border-[#B69A62]/40 shadow-card bg-gradient-to-br from-[#202B22] to-[#18251D]">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#294C36] text-[#D4BE8D] border border-[#B69A62]/40 flex items-center justify-center font-bold text-lg shadow-subtle">
                      <Wheat className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-serif font-bold text-[#D4BE8D] uppercase tracking-wider block">
                        Optimal Agricultural Recommendation
                      </span>
                      <h2 className="text-3xl font-serif font-bold text-[#F0EBDD] tracking-tight">
                        {result.primaryCrop}
                      </h2>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-[#A5AA96] block font-medium">Confidence Score</span>
                    <span className="text-2xl font-serif font-bold text-[#A4D5A4]">
                      {Math.round(result.confidence * 100)}%
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#D9CEB5] leading-relaxed py-3.5 border-y border-[#2D3B30]">
                  {result.rationale}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3.5 text-xs">
                  <div>
                    <span className="text-[#A5AA96] block text-[10px] uppercase font-semibold">Growing Season</span>
                    <span className="font-semibold text-[#F0EBDD]">{result.growingSeason}</span>
                  </div>
                  <div>
                    <span className="text-[#A5AA96] block text-[10px] uppercase font-semibold">Water Requirement</span>
                    <span className="font-semibold text-[#F0EBDD]">{result.waterRequirements}</span>
                  </div>
                  <div>
                    <span className="text-[#A5AA96] block text-[10px] uppercase font-semibold">Soil Profile</span>
                    <span className="font-semibold text-[#D4BE8D]">{result.soilSuitability}</span>
                  </div>
                </div>
              </Card>

              {/* Agronomic Guidance Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="border-l-2 border-l-[#71805A]">
                  <h4 className="text-xs font-serif font-bold text-[#D4BE8D] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#71805A]" />
                    Fertilizer Regimen
                  </h4>
                  <p className="text-xs text-[#A5AA96] leading-relaxed">
                    {result.agronomicAdvice.fertilizerGuidance}
                  </p>
                </Card>

                <Card className="border-l-2 border-l-[#2563EB]">
                  <h4 className="text-xs font-serif font-bold text-[#93C5FD] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-[#3B82F6]" />
                    Irrigation Protocol
                  </h4>
                  <p className="text-xs text-[#A5AA96] leading-relaxed">
                    {result.agronomicAdvice.irrigationSchedule}
                  </p>
                </Card>

                <Card className="border-l-2 border-l-[#79563C]">
                  <h4 className="text-xs font-serif font-bold text-[#D5BEA8] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-[#79563C]" />
                    Pest & Pathology Risk
                  </h4>
                  <p className="text-xs text-[#A5AA96] leading-relaxed">
                    {result.agronomicAdvice.pestRiskAssessment}
                  </p>
                </Card>

                <Card className="border-l-2 border-l-[#B69A62]">
                  <h4 className="text-xs font-serif font-bold text-[#D4BE8D] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-[#B69A62]" />
                    Market Realization (APMC)
                  </h4>
                  <p className="text-xs text-[#A5AA96] leading-relaxed">
                    {result.agronomicAdvice.marketPotential}
                  </p>
                </Card>
              </div>

              {/* Alternative Recommended Crops */}
              {result.alternatives && result.alternatives.length > 0 && (
                <Card>
                  <h4 className="text-xs font-serif font-bold text-[#F0EBDD] uppercase tracking-wider mb-3">
                    Secondary Crop Candidates
                  </h4>
                  <div className="space-y-2">
                    {result.alternatives.map((alt) => (
                      <div
                        key={alt.crop}
                        className="p-3 rounded-xl bg-[#18251D] border border-[#2D3B30] flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-[#F0EBDD]">{alt.crop}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-[#101B16] rounded-full h-1.5 overflow-hidden border border-[#2D3B30]">
                            <div
                              className="bg-[#B69A62] h-1.5 rounded-full"
                              style={{ width: `${alt.matchScorePercentage}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold text-[#D4BE8D] w-10 text-right">
                            {alt.matchScorePercentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Model Transparency */}
              <div className="p-3.5 rounded-xl bg-[#18251D] border border-[#2D3B30] text-xs text-[#A5AA96] flex flex-wrap items-center justify-between gap-2">
                <div>
                  <strong className="text-[#D9CEB5]">Inference Model:</strong> {result.modelMetadata.modelName} (v{result.modelMetadata.modelVersion})
                </div>
                <div>
                  <strong className="text-[#D9CEB5]">Cross-Validation:</strong> {(result.modelMetadata.evaluationAccuracy * 100).toFixed(1)}%
                </div>
                <div>
                  <strong className="text-[#D9CEB5]">Calibrated:</strong> {result.modelMetadata.trainedDate.split("T")[0]}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-[#18251D]/80 rounded-2xl border border-dashed border-[#2D3B30] min-h-[440px]">
              <div className="w-14 h-14 rounded-2xl bg-[#202B22] text-[#B69A62] border border-[#B69A62]/30 flex items-center justify-center mb-4 shadow-subtle">
                <Wheat className="w-7 h-7" />
              </div>
              <h3 className="text-base font-serif font-bold text-[#F0EBDD]">
                Awaiting Soil & Meteorological Parameters
              </h3>
              <p className="mt-1.5 text-xs text-[#A5AA96] max-w-sm leading-relaxed">
                Enter your soil testing card nutrients (NPK, pH) and micro-climate values on the left panel, then trigger "Compute Crop Recommendation" to perform inference.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
