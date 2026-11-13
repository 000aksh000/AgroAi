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
      {/* Welcome Banner: Clean Deep Forest Green SaaS Card */}
      <div className="p-6 sm:p-8 rounded-xl bg-[#174C35] text-white border border-[#123D2A] shadow-card relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 border border-white/15 text-white text-[11px] font-semibold mb-3 tracking-wide">
            <Sprout className="w-3.5 h-3.5 text-[#C7E7C7]" />
            <span>Agricultural Intelligence Platform</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Namaste, {user?.name || "Farmer"}
          </h1>

          <p className="mt-2 text-sm text-[#DCE9E2] leading-relaxed">
            {selectedFarm
              ? `Active Farm: ${selectedFarm.name} (${selectedFarm.area} ${selectedFarm.areaUnit}, ${selectedFarm.district}, ${selectedFarm.state} • ${selectedFarm.soilType} soil). Ready for crop analytics and advisory.`
              : "No farm profile selected. Select an existing plot or register a new one to enable targeted agronomic recommendations."}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link to="/crop-recommendation">
              <Button
                size="sm"
                className="bg-white text-[#174C35] hover:bg-[#F0F6F3] font-semibold shadow-xs"
                icon={<Wheat className="w-4 h-4 text-[#174C35]" />}
              >
                Run Crop Intelligence
              </Button>
            </Link>
            <Link to="/disease-detection">
              <Button
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold shadow-xs"
                icon={<ScanLine className="w-4 h-4 text-[#C7E7C7]" />}
              >
                Scan Leaf Disease
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverable className="border-t-2 border-t-[#174C35]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#788579] uppercase tracking-wider">
              My Farms
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#F0F6F3] text-[#174C35] border border-[#DCE9E2] flex items-center justify-center">
              <Tractor className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-[#202820] tracking-tight">
              {isLoadingStats ? "..." : statsData?.totalFarms ?? farms.length}
            </span>
            <span className="text-xs text-[#788579] block mt-0.5">Registered plots</span>
          </div>
        </Card>

        <Card hoverable className="border-t-2 border-t-[#65A765]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#788579] uppercase tracking-wider">
              Crop AI Runs
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#F3FAF3] text-[#65A765] border border-[#E4F4E4] flex items-center justify-center">
              <Wheat className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-[#202820] tracking-tight">
              {isLoadingStats ? "..." : statsData?.totalCropRecommendations ?? 0}
            </span>
            <span className="text-xs text-[#788579] block mt-0.5">Recommendations saved</span>
          </div>
        </Card>

        <Card hoverable className="border-t-2 border-t-[#8B6548]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#788579] uppercase tracking-wider">
              Disease Scans
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF6F2] text-[#8B6548] border border-[#E6D7C8] flex items-center justify-center">
              <ScanLine className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-[#202820] tracking-tight">
              {isLoadingStats ? "..." : statsData?.totalDiseaseScans ?? 0}
            </span>
            <span className="text-xs text-[#788579] block mt-0.5">Foliage photos evaluated</span>
          </div>
        </Card>

        <Card hoverable className="border-t-2 border-t-[#174C35]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#788579] uppercase tracking-wider">
              Crop Health
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#F0F6F3] text-[#174C35] border border-[#DCE9E2] flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-[#202820] tracking-tight">
              {isLoadingStats ? "..." : `${statsData?.healthyCropPercentage ?? 100}%`}
            </span>
            <span className="text-xs text-[#788579] block mt-0.5">Healthy foliage ratio</span>
          </div>
        </Card>
      </div>

      {/* Middle Grid: Live Weather Advisory & Quick Mandi Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Card */}
        <Card className="lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E8DD] mb-4">
              <div className="flex items-center gap-2">
                <CloudSun className="w-4.5 h-4.5 text-[#174C35]" />
                <h3 className="text-sm font-semibold text-[#202820]">Field Weather & Advisory</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={isLocating}
                  title="Detect GPS location"
                  className="p-1 rounded text-[#788579] hover:text-[#174C35] hover:bg-[#F0F6F3] transition-colors cursor-pointer"
                >
                  <MapPin className={`w-3.5 h-3.5 ${isLocating ? "animate-bounce text-[#174C35]" : ""}`} />
                </button>
                <Link to="/weather" className="text-xs text-[#174C35] font-semibold hover:underline">
                  7-Day Forecast
                </Link>
              </div>
            </div>

            {isLoadingWeather ? (
              <LoadingSkeleton count={3} className="h-10 mb-2" />
            ) : weatherData ? (
              <div>
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-3xl font-bold text-[#202820] tracking-tight">
                      {weatherData.current.temperature}°C
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs text-[#788579]">
                        {weatherData.current.weatherDescription} • {weatherData.location.city}
                        {weatherData.location.state &&
                        weatherData.location.state !== weatherData.location.city
                          ? `, ${weatherData.location.state}`
                          : ""}
                      </span>
                      {gpsCoords ? (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#174C35] bg-[#F0F6F3] border border-[#DCE9E2] px-1.5 py-0.5 rounded">
                          GPS
                        </span>
                      ) : selectedFarm ? (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#174C35] bg-[#F0F6F3] border border-[#DCE9E2] px-1.5 py-0.5 rounded">
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
                  <div className="p-2.5 rounded-lg bg-[#F7F8F2] border border-[#E5E8DD] flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-[#174C35]" />
                    <div>
                      <span className="text-[#788579] block text-[10px]">Humidity</span>
                      <span className="font-semibold text-[#202820]">
                        {weatherData.current.humidity}%
                      </span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F7F8F2] border border-[#E5E8DD] flex items-center gap-2">
                    <Wind className="w-4 h-4 text-[#788579]" />
                    <div>
                      <span className="text-[#788579] block text-[10px]">Wind Speed</span>
                      <span className="font-semibold text-[#202820]">
                        {weatherData.current.windSpeed} km/h
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#F0F6F3] border border-[#DCE9E2] text-xs text-[#174C35]">
                  <span className="font-semibold block mb-0.5 flex items-center gap-1.5">
                    <Sprout className="w-3.5 h-3.5" />
                    Irrigation Guidance:
                  </span>
                  <p className="leading-relaxed text-[#202820]">{weatherData.agriAdvisory.irrigationReason}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#788579]">Weather data currently updating.</p>
            )}
          </div>
        </Card>

        {/* Mandi Prices Snapshot */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E8DD] mb-4">
            <div className="flex items-center gap-2">
              <Store className="w-4.5 h-4.5 text-[#174C35]" />
              <h3 className="text-sm font-semibold text-[#202820]">APMC Mandi Price Snapshot</h3>
            </div>
            <Link to="/mandi-prices" className="text-xs text-[#174C35] font-semibold hover:underline">
              Explore All Mandis →
            </Link>
          </div>

          <div className="divide-y divide-[#E5E8DD]">
            {mandiPrices.map((m) => (
              <div key={m.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[#202820] text-sm">{m.commodity}</span>
                  <span className="text-[#788579] block text-[11px] mt-0.5">
                    {m.market} ({m.state}) • {m.variety}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#174C35] text-sm">
                    ₹{m.modalPrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#788579] block">per Quintal</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Grid: Recent Activity Feed */}
      <Card>
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E8DD] mb-4">
          <h3 className="text-sm font-semibold text-[#202820]">Recent Activity & Analytics</h3>
          <Link to="/history" className="text-xs text-[#174C35] font-semibold hover:underline">
            View Full History
          </Link>
        </div>

        {recentActivity.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#788579]">
            No activity records found. Run a crop recommendation or leaf scan to begin.
          </div>
        ) : (
          <div className="divide-y divide-[#E5E8DD]">
            {recentActivity.map((act) => (
              <div key={act.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg flex-shrink-0 border ${
                      act.type === "crop_recommendation"
                        ? "bg-[#F0F6F3] text-[#174C35] border-[#DCE9E2]"
                        : "bg-[#FAF6F2] text-[#8B6548] border-[#E6D7C8]"
                    }`}
                  >
                    {act.type === "crop_recommendation" ? (
                      <Wheat className="w-4 h-4" />
                    ) : (
                      <ScanLine className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-[#202820] text-sm">{act.title}</p>
                    <p className="text-[#788579] text-[11px] truncate max-w-md mt-0.5">
                      {act.summary}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-bold text-[#202820]">{Math.round(act.confidence * 100)}%</span>
                  <span className="text-[10px] text-[#788579] block">
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
