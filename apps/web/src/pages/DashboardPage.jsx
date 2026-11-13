import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Wheat,
  ScanLine,
  CloudSun,
  Store,
  Tractor,
  Shield,
  Droplets,
  Wind,
  MapPin,
  Sprout,
  Compass,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useFarm } from "../context/FarmContext";
import { apiClient } from "../api/client";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";

export const DashboardPage = () => {
  const { user } = useAuth();
  const { selectedFarm, farms } = useFarm();
  const [gpsCoords, setGpsCoords] = useState(() => {
    try {
      const saved = sessionStorage.getItem("agrosmart_gps");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (!gpsCoords && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
          setGpsCoords(coords);
          try {
            sessionStorage.setItem("agrosmart_gps", JSON.stringify(coords));
          } catch {}
        },
        () => {},
        { timeout: 6000, enableHighAccuracy: true }
      );
    }
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setGpsCoords(coords);
        try {
          sessionStorage.setItem("agrosmart_gps", JSON.stringify(coords));
        } catch {}
      },
      () => {
        setIsLocating(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await apiClient.get("/history/stats");
      return res.data.data;
    }
  });

  const { data: weatherData, isLoading: isLoadingWeather } = useQuery({
    queryKey: [
      "dashboard-weather",
      gpsCoords,
      selectedFarm?.id,
      selectedFarm?.district,
      user?.district
    ],
    queryFn: async () => {
      const params = {};
      if (gpsCoords) {
        params.latitude = gpsCoords.lat;
        params.longitude = gpsCoords.lon;
      } else if (selectedFarm?.latitude && selectedFarm?.longitude) {
        params.latitude = selectedFarm.latitude;
        params.longitude = selectedFarm.longitude;
      } else if (selectedFarm?.district) {
        params.city = selectedFarm.district;
      } else if (user?.district) {
        params.city = user.district;
      } else if (user?.state) {
        params.city = user.state;
      }
      const res = await apiClient.get("/weather", { params });
      return res.data.data;
    }
  });

  const { data: recentActivity = [] } = useQuery({
    queryKey: ["dashboard-activity"],
    queryFn: async () => {
      const res = await apiClient.get("/history/all?limit=5");
      return res.data.data;
    }
  });

  const { data: mandiPrices = [] } = useQuery({
    queryKey: ["dashboard-mandi"],
    queryFn: async () => {
      const res = await apiClient.get("/mandi/prices?limit=4");
      return res.data.data;
    }
  });

  return (
    <div className="space-y-7">
      {/* Editorial Botanical Hero Banner */}
      <div className="p-6 sm:p-9 rounded-2xl bg-gradient-to-br from-[#18251D] via-[#202B22] to-[#121E17] text-[#F0EBDD] border border-[#B69A62]/35 shadow-card relative overflow-hidden">
        {/* Subtle decorative background watermarks */}
        <div className="absolute -right-12 -bottom-16 w-80 h-80 opacity-5 pointer-events-none select-none">
          <svg viewBox="0 0 200 200" fill="currentColor">
            <path d="M100 0 C120 40 180 80 180 120 C180 160 140 190 100 200 C60 190 20 160 20 120 C20 80 80 40 100 0 Z" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[#71805A]/15 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101B16]/80 border border-[#B69A62]/30 text-[#D4BE8D] text-[11px] font-medium mb-4 tracking-wide shadow-subtle">
            <Compass className="w-3.5 h-3.5 text-[#B69A62]" />
            <span className="font-serif italic">Agricultural Research & Field Intelligence Journal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-[#F0EBDD]">
            Namaste, {user?.name || "Farmer"}
          </h1>

          <p className="mt-2.5 text-sm text-[#A5AA96] leading-relaxed">
            {selectedFarm ? (
              <span>
                Active Cultivation Plot: <strong className="text-[#D9CEB5]">{selectedFarm.name}</strong>{" "}
                ({selectedFarm.area} {selectedFarm.areaUnit}, {selectedFarm.district}, {selectedFarm.state} •{" "}
                <span className="text-[#D4BE8D]">{selectedFarm.soilType} Soil</span>). Calibrated for real-time agronomic analytics.
              </span>
            ) : (
              "No specific farm plot selected. Select an existing plot from the registry or initialize a new survey to unlock tailored soil intelligence."
            )}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link to="/crop-recommendation">
              <Button
                size="sm"
                className="bg-[#294C36] hover:bg-[#346045] text-[#F0EBDD] border border-[#B69A62]/40 shadow-subtle hover:shadow-gold-glow"
                icon={<Wheat className="w-4 h-4 text-[#D4BE8D]" />}
              >
                Run Crop Intelligence
              </Button>
            </Link>
            <Link to="/disease-detection">
              <Button
                variant="outline"
                size="sm"
                className="border-[#B69A62]/35 text-[#D9CEB5] hover:bg-[#18251D] hover:text-[#F0EBDD] hover:border-[#B69A62]"
                icon={<ScanLine className="w-4 h-4 text-[#A4D5A4]" />}
              >
                Scan Leaf Pathology
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverable className="border-t-2 border-t-[#B69A62]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#A5AA96] uppercase tracking-wider">
              Registered Plots
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#18251D] text-[#D4BE8D] border border-[#B69A62]/25 flex items-center justify-center">
              <Tractor className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-serif font-bold text-[#F0EBDD] tracking-tight">
              {isLoadingStats ? "..." : statsData?.totalFarms ?? farms.length}
            </span>
            <span className="text-xs text-[#A5AA96] block mt-0.5">Active field parcels</span>
          </div>
        </Card>

        <Card hoverable className="border-t-2 border-t-[#71805A]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#A5AA96] uppercase tracking-wider">
              Crop AI Inferences
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#18251D] text-[#A4D5A4] border border-[#71805A]/40 flex items-center justify-center">
              <Wheat className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-serif font-bold text-[#F0EBDD] tracking-tight">
              {isLoadingStats ? "..." : statsData?.totalCropRecommendations ?? 0}
            </span>
            <span className="text-xs text-[#A5AA96] block mt-0.5">Recommendations cataloged</span>
          </div>
        </Card>

        <Card hoverable className="border-t-2 border-t-[#79563C]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#A5AA96] uppercase tracking-wider">
              Disease Scans
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#18251D] text-[#D5BEA8] border border-[#79563C]/40 flex items-center justify-center">
              <ScanLine className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-serif font-bold text-[#F0EBDD] tracking-tight">
              {isLoadingStats ? "..." : statsData?.totalDiseaseScans ?? 0}
            </span>
            <span className="text-xs text-[#A5AA96] block mt-0.5">Leaf specimens inspected</span>
          </div>
        </Card>

        <Card hoverable className="border-t-2 border-t-[#294C36]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#A5AA96] uppercase tracking-wider">
              Foliage Health
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#18251D] text-[#D4BE8D] border border-[#B69A62]/25 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-serif font-bold text-[#A4D5A4] tracking-tight">
              {isLoadingStats ? "..." : `${statsData?.healthyCropPercentage ?? 100}%`}
            </span>
            <span className="text-xs text-[#A5AA96] block mt-0.5">Optimal health ratio</span>
          </div>
        </Card>
      </div>

      {/* Middle Grid: Live Weather Advisory & Quick Mandi Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Card */}
        <Card className="lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#2D3B30] mb-4">
              <div className="flex items-center gap-2">
                <CloudSun className="w-4.5 h-4.5 text-[#B69A62]" />
                <h3 className="text-sm font-serif font-bold text-[#F0EBDD]">Meteorological Station</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={isLocating}
                  title="Detect GPS location"
                  className="p-1 rounded text-[#A5AA96] hover:text-[#D4BE8D] hover:bg-[#18251D] transition-colors cursor-pointer"
                >
                  <MapPin className={`w-3.5 h-3.5 ${isLocating ? "animate-bounce text-[#B69A62]" : ""}`} />
                </button>
                <Link to="/weather" className="text-xs text-[#D4BE8D] font-medium hover:underline flex items-center gap-1">
                  7-Day Outlook <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {isLoadingWeather ? (
              <LoadingSkeleton count={3} className="h-10 mb-2" />
            ) : weatherData ? (
              <div>
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-3xl font-serif font-bold text-[#F0EBDD] tracking-tight">
                      {weatherData.current.temperature}°C
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs text-[#A5AA96]">
                        {weatherData.current.weatherDescription} • {weatherData.location.city}
                        {weatherData.location.state &&
                        weatherData.location.state !== weatherData.location.city
                          ? `, ${weatherData.location.state}`
                          : ""}
                      </span>
                      {gpsCoords ? (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#D4BE8D] bg-[#18251D] border border-[#B69A62]/30 px-1.5 py-0.5 rounded">
                          GPS
                        </span>
                      ) : selectedFarm ? (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#D4BE8D] bg-[#18251D] border border-[#B69A62]/30 px-1.5 py-0.5 rounded">
                          Farm
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <Badge
                    variant={
                      weatherData.agriAdvisory.sprayingCondition === "Optimal"
                        ? "success"
                        : weatherData.agriAdvisory.sprayingCondition === "Caution"
                        ? "warning"
                        : "danger"
                    }
                  >
                    Spraying: {weatherData.agriAdvisory.sprayingCondition}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div className="p-2.5 rounded-xl bg-[#18251D] border border-[#2D3B30] flex items-center gap-2.5">
                    <Droplets className="w-4 h-4 text-[#71805A]" />
                    <div>
                      <span className="text-[#A5AA96] block text-[10px]">Relative Humidity</span>
                      <span className="font-semibold text-[#F0EBDD]">
                        {weatherData.current.humidity}%
                      </span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#18251D] border border-[#2D3B30] flex items-center gap-2.5">
                    <Wind className="w-4 h-4 text-[#B69A62]" />
                    <div>
                      <span className="text-[#A5AA96] block text-[10px]">Wind Velocity</span>
                      <span className="font-semibold text-[#F0EBDD]">
                        {weatherData.current.windSpeed} km/h
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#18251D] border border-[#2D3B30] text-xs">
                  <span className="font-semibold text-[#D4BE8D] block mb-0.5 flex items-center gap-1.5">
                    <Sprout className="w-3.5 h-3.5 text-[#A4D5A4]" />
                    Irrigation Advisory:
                  </span>
                  <p className="leading-relaxed text-[#A5AA96]">{weatherData.agriAdvisory.irrigationReason}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#A5AA96]">Weather telemetry currently updating...</p>
            )}
          </div>
        </Card>

        {/* Mandi Prices Snapshot */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#2D3B30] mb-4">
            <div className="flex items-center gap-2">
              <Store className="w-4.5 h-4.5 text-[#B69A62]" />
              <h3 className="text-sm font-serif font-bold text-[#F0EBDD]">APMC Mandi Quotations</h3>
            </div>
            <Link to="/mandi-prices" className="text-xs text-[#D4BE8D] font-medium hover:underline flex items-center gap-1">
              Explore All Mandis <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-[#2D3B30]">
            {mandiPrices.map((m) => (
              <div key={m.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-serif font-bold text-[#F0EBDD] text-sm">{m.commodity}</span>
                  <span className="text-[#A5AA96] block text-[11px] mt-0.5">
                    {m.market} ({m.state}) • <span className="text-[#D9CEB5]">{m.variety}</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-[#D4BE8D] text-sm">
                    ₹{m.modalPrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#A5AA96] block">per Quintal</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Grid: Recent Activity Feed */}
      <Card>
        <div className="flex items-center justify-between pb-3.5 border-b border-[#2D3B30] mb-4">
          <h3 className="text-sm font-serif font-bold text-[#F0EBDD]">Field Log & Historical Audits</h3>
          <Link to="/history" className="text-xs text-[#D4BE8D] font-medium hover:underline flex items-center gap-1">
            View Complete Log <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentActivity.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#A5AA96]">
            No records logged. Execute a crop recommendation or leaf diagnosis to populate the journal.
          </div>
        ) : (
          <div className="divide-y divide-[#2D3B30]">
            {recentActivity.map((act) => (
              <div key={act.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl flex-shrink-0 border ${
                      act.type === "crop_recommendation"
                        ? "bg-[#294C36]/40 text-[#A4D5A4] border-[#294C36]"
                        : "bg-[#79563C]/35 text-[#D5BEA8] border-[#79563C]/60"
                    }`}
                  >
                    {act.type === "crop_recommendation" ? (
                      <Wheat className="w-4 h-4" />
                    ) : (
                      <ScanLine className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-serif font-bold text-[#F0EBDD] text-sm">{act.title}</p>
                    <p className="text-[#A5AA96] text-[11px] truncate max-w-md mt-0.5">
                      {act.summary}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-mono font-bold text-[#D4BE8D]">{Math.round(act.confidence * 100)}%</span>
                  <span className="text-[10px] text-[#A5AA96] block font-mono">
                    {new Date(act.createdAt).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric"
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
