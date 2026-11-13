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
  Leaf,
  Sprout
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
    <div className="space-y-6">
      {/* Welcome Banner: Sandy Soil + Canopy Leaf Vibe */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#173827] via-[#244f38] to-[#433525] text-white shadow-warm-lg border border-leaf-700/30 relative overflow-hidden">
        {/* Subtle Foliage / Soil Motifs */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-6 translate-y-6">
          <Wheat className="w-80 h-80 text-sand-200" />
        </div>
        <div className="absolute -right-10 -top-10 opacity-5 pointer-events-none">
          <Leaf className="w-64 h-64 text-emerald-300" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <Badge
            variant="sand"
            className="mb-3.5 bg-white/15 text-sand-100 border-white/20 backdrop-blur-md px-3 py-1 font-semibold"
          >
            <Sprout className="w-3.5 h-3.5 text-leaf-300 inline mr-1" />
            Agricultural Decision & Soil Intelligence
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-xs">
            Namaste, {user?.name || "Farmer"}!
          </h1>
          <p className="mt-2 text-sm text-sand-100/90 leading-relaxed font-normal">
            {selectedFarm
              ? `Active plot: ${selectedFarm.name} (${selectedFarm.area} ${selectedFarm.areaUnit}, ${selectedFarm.district}, ${selectedFarm.state} • ${selectedFarm.soilType} soil). Ready to generate crop intelligence.`
              : "No active farm selected. Add or select a farm plot to tailor soil recommendations and hyper-local microclimate insights."}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link to="/crop-recommendation">
              <Button
                size="sm"
                className="bg-[#fffefc] text-leaf-900 hover:bg-sand-50 font-bold shadow-sm"
                icon={<Wheat className="w-4 h-4 text-harvest-600" />}
              >
                Run Crop Recommendation
              </Button>
            </Link>
            <Link to="/disease-detection">
              <Button
                size="sm"
                className="bg-leaf-500/25 hover:bg-leaf-500/35 text-white border border-leaf-300/50 backdrop-blur-md font-bold shadow-sm"
                icon={<ScanLine className="w-4 h-4 text-leaf-200" />}
              >
                Scan Leaf Disease
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverable className="border-t-3 border-t-leaf-600">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-soil-500 uppercase tracking-wider">
              My Farms
            </span>
            <div className="p-2 rounded-xl bg-leaf-100 text-leaf-800 border border-leaf-200/60">
              <Tractor className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-black text-soil-900 tracking-tight">
              {isLoadingStats ? "..." : statsData?.totalFarms ?? farms.length}
            </span>
            <span className="text-xs text-soil-400 block mt-0.5 font-medium">Registered plots</span>
          </div>
        </Card>

        <Card hoverable className="border-t-3 border-t-harvest-500">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-soil-500 uppercase tracking-wider">
              Crop AI Runs
            </span>
            <div className="p-2 rounded-xl bg-harvest-100 text-harvest-800 border border-harvest-200/60">
              <Wheat className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-black text-soil-900 tracking-tight">
              {isLoadingStats ? "..." : statsData?.totalCropRecommendations ?? 0}
            </span>
            <span className="text-xs text-soil-400 block mt-0.5 font-medium">Predictions saved</span>
          </div>
        </Card>

        <Card hoverable className="border-t-3 border-t-soil-500">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-soil-500 uppercase tracking-wider">
              Disease Scans
            </span>
            <div className="p-2 rounded-xl bg-soil-100 text-soil-800 border border-soil-200/60">
              <ScanLine className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-black text-soil-900 tracking-tight">
              {isLoadingStats ? "..." : statsData?.totalDiseaseScans ?? 0}
            </span>
            <span className="text-xs text-soil-400 block mt-0.5 font-medium">Leaf photos tested</span>
          </div>
        </Card>

        <Card hoverable className="border-t-3 border-t-emerald-600">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-soil-500 uppercase tracking-wider">
              Crop Health
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200/60">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-black text-soil-900 tracking-tight">
              {isLoadingStats ? "..." : `${statsData?.healthyCropPercentage ?? 100}%`}
            </span>
            <span className="text-xs text-soil-400 block mt-0.5 font-medium">Healthy foliage ratio</span>
          </div>
        </Card>
      </div>

      {/* Middle Grid: Live Weather Advisory & Quick Mandi Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Card */}
        <Card className="lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-sand-200/80 mb-4">
              <div className="flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-soil-900">Field Weather & Advisory</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={isLocating}
                  title="Detect live GPS location"
                  className="p-1 rounded-lg text-soil-400 hover:text-leaf-700 hover:bg-sand-100 transition-colors cursor-pointer"
                >
                  <MapPin className={`w-3.5 h-3.5 ${isLocating ? "animate-bounce text-leaf-600" : ""}`} />
                </button>
                <Link to="/weather" className="text-xs text-leaf-700 font-bold hover:underline">
                  View 7-day
                </Link>
              </div>
            </div>

            {isLoadingWeather ? (
              <LoadingSkeleton count={3} className="h-10 mb-2" />
            ) : weatherData ? (
              <div>
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-4xl font-black text-soil-900 tracking-tight">
                      {weatherData.current.temperature}°C
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs text-soil-500 font-medium">
                        {weatherData.current.weatherDescription} • {weatherData.location.city}
                        {weatherData.location.state &&
                        weatherData.location.state !== weatherData.location.city
                          ? `, ${weatherData.location.state}`
                          : ""}
                      </span>
                      {gpsCoords ? (
                        <span className="text-[9px] font-black tracking-wider uppercase text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 rounded-md">
                          GPS
                        </span>
                      ) : selectedFarm ? (
                        <span className="text-[9px] font-black tracking-wider uppercase text-leaf-800 bg-leaf-100 border border-leaf-300 px-1.5 py-0.5 rounded-md">
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
                  <div className="p-2.5 rounded-xl bg-sand-100/70 border border-sand-200/80 flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="text-soil-400 block text-[10px] font-semibold">Humidity</span>
                      <span className="font-bold text-soil-900">
                        {weatherData.current.humidity}%
                      </span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-sand-100/70 border border-sand-200/80 flex items-center gap-2">
                    <Wind className="w-4 h-4 text-soil-500" />
                    <div>
                      <span className="text-soil-400 block text-[10px] font-semibold">Wind Speed</span>
                      <span className="font-bold text-soil-900">
                        {weatherData.current.windSpeed} km/h
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-leaf-50/80 border border-leaf-200/90 text-xs text-leaf-950">
                  <span className="font-bold block mb-1 text-leaf-900 flex items-center gap-1.5">
                    <Sprout className="w-3.5 h-3.5 text-leaf-700" />
                    Soil & Irrigation Advice:
                  </span>
                  <p className="leading-relaxed font-medium">{weatherData.agriAdvisory.irrigationReason}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-soil-500">Weather data currently updating.</p>
            )}
          </div>
        </Card>

        {/* Mandi Prices Snapshot */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-sand-200/80 mb-4">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-harvest-600" />
              <h3 className="text-sm font-bold text-soil-900">APMC Mandi Price Snapshot (Live)</h3>
            </div>
            <Link to="/mandi-prices" className="text-xs text-leaf-700 font-bold hover:underline">
              Explore All Mandis →
            </Link>
          </div>

          <div className="divide-y divide-sand-200/70">
            {mandiPrices.map((m) => (
              <div key={m.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-soil-900 text-sm">{m.commodity}</span>
                  <span className="text-soil-400 block text-[11px] font-medium mt-0.5">
                    {m.market} ({m.state}) • {m.variety}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-black text-soil-950 text-sm">
                    ₹{m.modalPrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-soil-400 block font-medium">per Quintal</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Grid: Recent Activity Feed */}
      <Card>
        <div className="flex items-center justify-between pb-3 border-b border-sand-200/80 mb-4">
          <h3 className="text-sm font-bold text-soil-900">Recent Field Activities & Diagnoses</h3>
          <Link to="/history" className="text-xs text-leaf-700 font-bold hover:underline">
            View Full History
          </Link>
        </div>

        {recentActivity.length === 0 ? (
          <div className="text-center py-8 text-xs text-soil-400">
            No activities recorded yet. Run a crop recommendation or leaf scan to begin.
          </div>
        ) : (
          <div className="divide-y divide-sand-200/70">
            {recentActivity.map((act) => (
              <div key={act.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl flex-shrink-0 border ${
                      act.type === "crop_recommendation"
                        ? "bg-leaf-100 text-leaf-800 border-leaf-200/70"
                        : "bg-sand-200 text-soil-800 border-sand-300/70"
                    }`}
                  >
                    {act.type === "crop_recommendation" ? (
                      <Wheat className="w-4 h-4" />
                    ) : (
                      <ScanLine className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-soil-900 text-sm">{act.title}</p>
                    <p className="text-soil-500 text-[11px] truncate max-w-md font-medium mt-0.5">
                      {act.summary}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-black text-soil-900">{Math.round(act.confidence * 100)}%</span>
                  <span className="text-[10px] text-soil-400 block font-medium">
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
