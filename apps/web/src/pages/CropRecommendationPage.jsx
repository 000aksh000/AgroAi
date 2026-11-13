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
  History
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
        err.response?.data?.error?.message || "Failed to run crop recommendation. Please check inputs and ensure ML service is running."
      );
    }
  });
  return <div className="space-y-6">
      {
    /* Header */
  }
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-sand-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-soil-900 tracking-tight">
              AI Crop Recommendation Engine
            </h1>
            <Badge variant="leaf" size="sm">Scikit-Learn ML</Badge>
          </div>
          <p className="text-xs text-soil-500 mt-1 font-medium">
            Predict agronomically suitable crops based on soil nutrient testing and meteorological patterns.
          </p>
        </div>

        <Link to="/history">
          <Button variant="outline" size="sm" icon={<History className="w-4 h-4" />}>
            View Past Recommendations
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {
    /* Form Inputs (5 cols on lg) */
  }
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Agronomic Parameters
              </span>
              <div className="flex gap-1.5">
                {selectedFarm && <button
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
    className="text-[11px] font-semibold text-agri-700 hover:text-agri-800 bg-agri-50 px-2 py-1 rounded-lg flex items-center gap-1"
    title="Populate from farm"
  >
                    <Tractor className="w-3 h-3" />
                    Fill Farm NPK
                  </button>}
                <button
    type="button"
    onClick={handleAutoFillWeather}
    className="text-[11px] font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded-lg flex items-center gap-1"
    title="Populate from live weather"
  >
                  <CloudSun className="w-3 h-3" />
                  Fill Weather
                </button>
              </div>
            </div>

            {error && <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>}

            <form
    onSubmit={(e) => {
      e.preventDefault();
      recommendMutation.mutate();
    }}
    className="space-y-4"
  >
              {
    /* Soil Macronutrients */
  }
              <div className="p-3.5 rounded-2xl bg-sand-50/80 border border-sand-200/80 space-y-3">
                <span className="text-xs font-bold text-soil-800 block">
                  Soil Nutrients (Soil Health Card)
                </span>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Nitrogen (N)
                    </label>
                    <div className="relative">
                      <input
    type="number"
    min="0"
    max="300"
    required
    value={form.nitrogen}
    onChange={(e) => setForm({ ...form, nitrogen: parseInt(e.target.value, 10) || 0 })}
    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 font-semibold"
  />
                      <span className="text-[10px] text-slate-400 block mt-0.5">kg/ha</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Phosphorus (P)
                    </label>
                    <div className="relative">
                      <input
    type="number"
    min="0"
    max="200"
    required
    value={form.phosphorus}
    onChange={(e) => setForm({ ...form, phosphorus: parseInt(e.target.value, 10) || 0 })}
    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 font-semibold"
  />
                      <span className="text-[10px] text-slate-400 block mt-0.5">kg/ha</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Potassium (K)
                    </label>
                    <div className="relative">
                      <input
    type="number"
    min="0"
    max="300"
    required
    value={form.potassium}
    onChange={(e) => setForm({ ...form, potassium: parseInt(e.target.value, 10) || 0 })}
    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 font-semibold"
  />
                      <span className="text-[10px] text-slate-400 block mt-0.5">kg/ha</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-medium text-slate-600">Soil pH: <strong className="text-slate-900">{form.soilPh}</strong></span>
                    <span className="text-slate-400">
                      {form.soilPh < 6 ? "Acidic" : form.soilPh > 7.5 ? "Alkaline" : "Neutral"}
                    </span>
                  </div>
                  <input
    type="range"
    min="4.0"
    max="9.0"
    step="0.1"
    value={form.soilPh}
    onChange={(e) => setForm({ ...form, soilPh: parseFloat(e.target.value) })}
    className="w-full accent-agri-600 cursor-pointer"
  />
                </div>
              </div>

              {
    /* Climate & Weather */
  }
              <div className="p-3.5 rounded-2xl bg-sand-50/80 border border-sand-200/80 space-y-3">
                <span className="text-xs font-bold text-soil-800 block">
                  Climate & Seasonal Factors
                </span>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Temp (°C)
                    </label>
                    <input
    type="number"
    min="5"
    max="55"
    required
    value={form.temperature}
    onChange={(e) => setForm({ ...form, temperature: parseInt(e.target.value, 10) || 0 })}
    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 font-semibold"
  />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Humidity (%)
                    </label>
                    <input
    type="number"
    min="10"
    max="100"
    required
    value={form.humidity}
    onChange={(e) => setForm({ ...form, humidity: parseInt(e.target.value, 10) || 0 })}
    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 font-semibold"
  />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Rainfall (mm)
                    </label>
                    <input
    type="number"
    min="0"
    max="500"
    required
    value={form.rainfall}
    onChange={(e) => setForm({ ...form, rainfall: parseInt(e.target.value, 10) || 0 })}
    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 font-semibold"
  />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Season</label>
                    <select
    value={form.season}
    onChange={(e) => setForm({ ...form, season: e.target.value })}
    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 bg-white"
  >
                      <option value="Kharif">Kharif (Monsoon)</option>
                      <option value="Rabi">Rabi (Winter)</option>
                      <option value="Zaid">Zaid (Summer)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">District</label>
                    <input
    type="text"
    placeholder="e.g. Nashik"
    value={form.district}
    onChange={(e) => setForm({ ...form, district: e.target.value })}
    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500"
  />
                  </div>
                </div>
              </div>

              <Button
    type="submit"
    isLoading={recommendMutation.isPending}
    className="w-full shadow-md"
    icon={<Sparkles className="w-4 h-4" />}
  >
                Compute Crop Recommendation
              </Button>
            </form>
          </Card>
        </div>

        {
    /* Results Area (7 cols on lg) */
  }
        <div className="lg:col-span-7">
          {result ? <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              {
    /* Primary Crop Card */
  }
              <Card className="border-t-4 border-t-agri-600 bg-gradient-to-br from-white via-white to-agri-50/40">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-agri-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-agri-600/25">
                      <Wheat className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-agri-700 uppercase tracking-wider block">
                        Optimal Crop Selection
                      </span>
                      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        {result.primaryCrop}
                      </h2>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Confidence Score</span>
                    <span className="text-2xl font-black text-emerald-700">
                      {Math.round(result.confidence * 100)}%
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed py-3 border-y border-slate-100">
                  {result.rationale}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Season</span>
                    <span className="font-bold text-slate-800">{result.growingSeason}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Water Need</span>
                    <span className="font-bold text-slate-800">{result.waterRequirements}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Soil Suitability</span>
                    <span className="font-bold text-slate-800">{result.soilSuitability}</span>
                  </div>
                </div>
              </Card>

              {
    /* Agronomic Guidance Cards */
  }
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="border-l-4 border-l-agri-600">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-agri-600" />
                    Fertilizer Management
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {result.agronomicAdvice.fertilizerGuidance}
                  </p>
                </Card>

                <Card className="border-l-4 border-l-blue-600">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-blue-600" />
                    Irrigation Schedule
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {result.agronomicAdvice.irrigationSchedule}
                  </p>
                </Card>

                <Card className="border-l-4 border-l-amber-600">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Pest Risk Assessment
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {result.agronomicAdvice.pestRiskAssessment}
                  </p>
                </Card>

                <Card className="border-l-4 border-l-emerald-600">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    Market Potential (APMC)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {result.agronomicAdvice.marketPotential}
                  </p>
                </Card>
              </div>

              {
    /* Alternative Recommended Crops */
  }
              {result.alternatives && result.alternatives.length > 0 && <Card>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                    Alternative Crop Candidates
                  </h4>
                  <div className="space-y-2.5">
                    {result.alternatives.map((alt) => <div
    key={alt.crop}
    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
  >
                        <span className="font-bold text-slate-900">{alt.crop}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
    className="bg-agri-600 h-2 rounded-full"
    style={{ width: `${alt.matchScorePercentage}%` }}
  />
                          </div>
                          <span className="font-bold text-slate-700 w-10 text-right">
                            {alt.matchScorePercentage}%
                          </span>
                        </div>
                      </div>)}
                  </div>
                </Card>}

              {
    /* Model Transparency & Versioning Footer */
  }
              <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200/80 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <strong>Model:</strong> {result.modelMetadata.modelName} (v{result.modelMetadata.modelVersion})
                </div>
                <div>
                  <strong>Validation Accuracy:</strong> {(result.modelMetadata.evaluationAccuracy * 100).toFixed(1)}%
                </div>
                <div>
                  <strong>Trained:</strong> {result.modelMetadata.trainedDate.split("T")[0]}
                </div>
              </div>
            </div> : <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 min-h-[420px]">
              <div className="w-16 h-16 rounded-2xl bg-earth-100 text-earth-700 flex items-center justify-center mb-4">
                <Wheat className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Awaiting Soil & Climatic Parameters
              </h3>
              <p className="mt-1.5 text-xs text-slate-500 max-w-sm leading-relaxed">
                Fill in your Nitrogen, Phosphorus, Potassium, and weather measurements on the left and click "Compute Crop Recommendation" to trigger machine learning inference.
              </p>
            </div>}
        </div>
      </div>
    </div>;
};
