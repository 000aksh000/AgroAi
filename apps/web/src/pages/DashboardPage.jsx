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
  MapPin
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
          } catch {
          }
        },
        () => {
        },
        { timeout: 6e3, enableHighAccuracy: true }
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
        } catch {
        }
      },
      () => {
        setIsLocating(false);
      },
      { timeout: 8e3, enableHighAccuracy: true }
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
    queryKey: ["dashboard-weather", gpsCoords, selectedFarm?.id, selectedFarm?.district, user?.district],
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
  return <div className="space-y-6">
      {
    /* Welcome Banner */
  }
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-agri-800 via-agri-700 to-emerald-800 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-8 translate-y-8">
          <Wheat className="w-80 h-80" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <Badge variant="earth" className="mb-3 bg-white/20 text-white border-white/30 backdrop-blur-sm">
            🌾 Agricultural Decision Engine
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Namaste, {user?.name || "Farmer"}!
          </h1>
          <p className="mt-2 text-sm text-emerald-100 leading-relaxed">
            {selectedFarm ? `Active farm: ${selectedFarm.name} (${selectedFarm.area} ${selectedFarm.areaUnit}, ${selectedFarm.district}, ${selectedFarm.state}). Ready to generate crop intelligence.` : "You have no active farm selected. Add or select a farm profile to tailor recommendations and weather insights."}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/crop-recommendation">
              <Button size="sm" className="bg-white text-agri-800 hover:bg-emerald-50 font-semibold shadow-sm">
                Run Crop Recommendation
              </Button>
            </Link>
            <Link to="/disease-detection">
              <Button
    size="sm"
    className="bg-white/15 hover:bg-white/25 text-white border border-white/50 backdrop-blur-sm font-semibold shadow-sm"
  >
                Scan Leaf Disease
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {
    /* 4 Stats Cards */
  }
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverable className="border-l-4 border-l-agri-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">My Farms</span>
            <div className="p-2 rounded-xl bg-agri-100 text-agri-700">
              <Tractor className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {isLoadingStats ? "..." : statsData?.totalFarms ?? farms.length}
            </span>
            <span className="text-xs text-slate-400 block mt-0.5">Active farm plots</span>
          </div>
        </Card>

        <Card hoverable className="border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Crop AI Runs</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Wheat className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {isLoadingStats ? "..." : statsData?.totalCropRecommendations ?? 0}
            </span>
            <span className="text-xs text-slate-400 block mt-0.5">Predictions saved</span>
          </div>
        </Card>

        <Card hoverable className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Disease Scans</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <ScanLine className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {isLoadingStats ? "..." : statsData?.totalDiseaseScans ?? 0}
            </span>
            <span className="text-xs text-slate-400 block mt-0.5">Images evaluated</span>
          </div>
        </Card>

        <Card hoverable className="border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Crop Health</span>
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {isLoadingStats ? "..." : `${statsData?.healthyCropPercentage ?? 100}%`}
            </span>
            <span className="text-xs text-slate-400 block mt-0.5">Healthy plant ratio</span>
          </div>
        </Card>
      </div>

      {
    /* Middle Grid: Live Weather Advisory & Quick Mandi Snapshot */
  }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {
    /* Weather Card */
  }
        <Card className="lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-800">Field Weather & Advisory</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
    type="button"
    onClick={detectLocation}
    disabled={isLocating}
    title="Detect live GPS location"
    className="p-1 rounded-lg text-slate-400 hover:text-agri-600 hover:bg-slate-100 transition-colors"
  >
                  <MapPin className={`w-3.5 h-3.5 ${isLocating ? "animate-bounce text-agri-600" : ""}`} />
                </button>
                <Link to="/weather" className="text-xs text-agri-600 font-semibold hover:underline">
                  View 7-day
                </Link>
              </div>
            </div>

            {isLoadingWeather ? <LoadingSkeleton count={3} className="h-10 mb-2" /> : weatherData ? <div>
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-4xl font-extrabold text-slate-900">
                      {weatherData.current.temperature}°C
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs text-slate-500">
                        {weatherData.current.weatherDescription} • {weatherData.location.city}
                        {weatherData.location.state && weatherData.location.state !== weatherData.location.city ? `, ${weatherData.location.state}` : ""}
                      </span>
                      {gpsCoords ? <span className="text-[9px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                          GPS
                        </span> : selectedFarm ? <span className="text-[9px] font-bold tracking-wider uppercase text-agri-700 bg-agri-100 px-1.5 py-0.5 rounded">
                          Farm
                        </span> : null}
                    </div>
                  </div>
                  <Badge
    variant={weatherData.agriAdvisory.sprayingCondition === "Optimal" ? "success" : weatherData.agriAdvisory.sprayingCondition === "Caution" ? "warning" : "danger"}
  >
                    Spraying: {weatherData.agriAdvisory.sprayingCondition}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div className="p-2.5 rounded-xl bg-slate-50 flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">Humidity</span>
                      <span className="font-semibold text-slate-800">{weatherData.current.humidity}%</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 flex items-center gap-2">
                    <Wind className="w-4 h-4 text-slate-500" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">Wind Speed</span>
                      <span className="font-semibold text-slate-800">{weatherData.current.windSpeed} km/h</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-agri-50 border border-agri-200/80 text-xs text-agri-900">
                  <span className="font-semibold block mb-0.5">Irrigation Advice:</span>
                  {weatherData.agriAdvisory.irrigationReason}
                </div>
              </div> : <p className="text-xs text-slate-500">Weather data currently updating.</p>}
          </div>
        </Card>

        {
    /* Mandi Prices Snapshot */
  }
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-800">APMC Mandi Price Snapshot (Live)</h3>
            </div>
            <Link to="/mandi-prices" className="text-xs text-agri-600 font-semibold hover:underline">
              Explore All Mandis →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {mandiPrices.map((m) => <div key={m.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 text-sm">{m.commodity}</span>
                  <span className="text-slate-400 block text-[11px]">
                    {m.market} ({m.state}) • {m.variety}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-slate-900 text-sm">₹{m.modalPrice.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 block">per Quintal</span>
                </div>
              </div>)}
          </div>
        </Card>
      </div>

      {
    /* Bottom Grid: Recent Activity Feed */
  }
      <Card>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <h3 className="text-sm font-bold text-slate-800">Recent Field Activities & Diagnoses</h3>
          <Link to="/history" className="text-xs text-agri-600 font-semibold hover:underline">
            View Full History
          </Link>
        </div>

        {recentActivity.length === 0 ? <div className="text-center py-8 text-xs text-slate-400">
            No activities recorded yet. Run a crop recommendation or leaf scan to begin.
          </div> : <div className="divide-y divide-slate-100">
            {recentActivity.map((act) => <div key={act.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl flex-shrink-0 ${act.type === "crop_recommendation" ? "bg-agri-100 text-agri-700" : "bg-amber-100 text-amber-700"}`}>
                    {act.type === "crop_recommendation" ? <Wheat className="w-4 h-4" /> : <ScanLine className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{act.title}</p>
                    <p className="text-slate-500 text-[11px] truncate max-w-md">{act.summary}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-bold text-slate-800">{Math.round(act.confidence * 100)}%</span>
                  <span className="text-[10px] text-slate-400 block">
                    {new Date(act.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>)}
          </div>}
      </Card>
    </div>;
};
