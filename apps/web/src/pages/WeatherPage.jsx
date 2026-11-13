import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CloudSun,
  Search,
  Droplets,
  Wind,
  Compass,
  RefreshCw,
  Tractor,
  MapPin
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { useFarm } from "../context/FarmContext";
import { apiClient } from "../api/client";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";

const POPULAR_AGRI_DISTRICTS = [
  "Delhi",
  "Ambedkar Nagar",
  "Lucknow",
  "Varanasi",
  "Ludhiana",
  "Pune",
  "Nashik",
  "Karnal",
  "Patna",
  "Indore",
  "Jaipur",
  "Ahmedabad"
];

export const WeatherPage = () => {
  const { selectedFarm } = useFarm();
  const [cityInput, setCityInput] = useState("");
  const [activeCity, setActiveCity] = useState(
    selectedFarm?.district || selectedFarm?.state || "Delhi"
  );
  const [gpsCoords, setGpsCoords] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const { data: weather, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["weather-full", activeCity, gpsCoords, selectedFarm?.id],
    queryFn: async () => {
      const params = {};
      if (gpsCoords) {
        params.latitude = gpsCoords.lat;
        params.longitude = gpsCoords.lon;
      } else if (activeCity) {
        params.city = activeCity;
      } else if (selectedFarm?.district) {
        params.city = selectedFarm.district;
      } else {
        params.city = "Delhi";
      }
      const res = await apiClient.get("/weather", { params });
      return res.data.data;
    }
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      setGpsCoords(null);
      setActiveCity(cityInput.trim());
    }
  };

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setActiveCity("");
        setGpsCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        });
      },
      (err) => {
        setIsLocating(false);
        alert("Could not access your location. Please check browser permissions or search by city name.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const chartData = (weather?.forecast || []).map((f) => ({
    name: f.dayName,
    maxTemp: f.tempMax,
    minTemp: f.tempMin,
    rain: f.precipitationSum,
    prob: f.precipitationProbability
  }));

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#2D3B30]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-[#F0EBDD] tracking-tight">
              Agronomic Meteorological Observatory
            </h1>
            <Badge variant="gold" size="sm">
              Open-Meteo Live
            </Badge>
          </div>
          <p className="text-xs text-[#A5AA96] mt-1 font-medium">
            Real-time micro-climate monitoring and agricultural spray windows tailored for field operations.
          </p>
        </div>

        {/* Search bar & GPS Locate */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 md:w-72">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#A5AA96] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search district, mandi, or state..."
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#2D3B30] focus:outline-none focus:ring-2 focus:ring-[#B69A62] bg-[#101B16] text-[#F0EBDD] placeholder:text-[#A5AA96]/50"
              />
            </div>
            <Button type="submit" size="sm" className="bg-[#294C36] hover:bg-[#346045] text-[#F0EBDD] border border-[#B69A62]/40">
              Search
            </Button>
          </form>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleUseGps}
            isLoading={isLocating}
            title="Use current GPS location"
            className="flex items-center gap-1.5 whitespace-nowrap border-[#B69A62]/40 text-[#D4BE8D]"
          >
            <MapPin className="w-3.5 h-3.5 text-[#B69A62]" />
            <span className="hidden sm:inline">Locate</span>
          </Button>
        </div>
      </div>

      {/* Quick Location Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[#A5AA96] font-medium flex-shrink-0 font-serif italic">Districts:</span>
        {selectedFarm && (
          <button
            onClick={() => {
              setGpsCoords(null);
              setActiveCity(selectedFarm.district || selectedFarm.name);
            }}
            className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 flex-shrink-0 transition-colors cursor-pointer border ${
              !gpsCoords &&
              activeCity.toLowerCase() === (selectedFarm.district || selectedFarm.name).toLowerCase()
                ? "bg-[#202B22] text-[#F0EBDD] border-[#B69A62] shadow-subtle"
                : "bg-[#18251D] text-[#D9CEB5] border-[#2D3B30] hover:bg-[#202B22]"
            }`}
          >
            <Tractor className="w-3 h-3 text-[#B69A62]" /> {selectedFarm.name}
          </button>
        )}
        {POPULAR_AGRI_DISTRICTS.map((dist) => (
          <button
            key={dist}
            onClick={() => {
              setGpsCoords(null);
              setActiveCity(dist);
            }}
            className={`px-3 py-1.5 rounded-xl flex-shrink-0 transition-colors cursor-pointer border ${
              !gpsCoords && activeCity.toLowerCase() === dist.toLowerCase()
                ? "bg-[#202B22] text-[#F0EBDD] font-semibold border-[#B69A62] shadow-subtle"
                : "bg-[#18251D] border border-[#2D3B30] text-[#A5AA96] hover:bg-[#202B22] hover:text-[#F0EBDD]"
            }`}
          >
            {dist}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSkeleton count={4} className="h-32 mb-4" />
      ) : weather ? (
        <div className="space-y-6">
          {/* Top Conditions & Advisories Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Current Weather Card */}
            <Card className="lg:col-span-5 bg-gradient-to-br from-[#18251D] via-[#202B22] to-[#121E17] text-[#F0EBDD] border-[#B69A62]/35 shadow-card">
              <div className="flex items-center justify-between pb-3.5 border-b border-[#2D3B30]">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#F0EBDD]">{weather.location.city}</h3>
                  <span className="text-xs text-[#A5AA96]">
                    {weather.location.state ? `${weather.location.state}, ` : ""}
                    {weather.location.country}
                  </span>
                </div>
                <button
                  onClick={() => refetch()}
                  className={`p-1.5 rounded-lg text-[#A5AA96] hover:text-[#F0EBDD] hover:bg-[#101B16] transition-colors cursor-pointer ${
                    isFetching ? "animate-spin text-[#B69A62]" : ""
                  }`}
                  title="Refresh weather data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <div className="py-6 flex items-baseline justify-between">
                <div>
                  <span className="text-5xl font-serif font-bold tracking-tight text-[#F0EBDD]">
                    {weather.current.temperature}°C
                  </span>
                  <span className="text-xs text-[#D9CEB5] block mt-1.5 font-medium">
                    Feels like {weather.current.apparentTemperature}°C • {weather.current.weatherDescription}
                  </span>
                </div>
                <div className="text-right">
                  <CloudSun className="w-12 h-12 text-[#B69A62] ml-auto drop-shadow" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-[#2D3B30] text-xs">
                <div className="p-2.5 rounded-xl bg-[#101B16]/70 border border-[#2D3B30] flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-[#71805A]" />
                  <div>
                    <span className="text-[10px] text-[#A5AA96] block">Humidity</span>
                    <span className="font-bold text-[#F0EBDD]">{weather.current.humidity}%</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#101B16]/70 border border-[#2D3B30] flex items-center gap-2">
                  <Wind className="w-4 h-4 text-[#B69A62]" />
                  <div>
                    <span className="text-[10px] text-[#A5AA96] block">Wind</span>
                    <span className="font-bold text-[#F0EBDD]">{weather.current.windSpeed} km/h</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#101B16]/70 border border-[#2D3B30] flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#A4D5A4]" />
                  <div>
                    <span className="text-[10px] text-[#A5AA96] block">Rain Vol</span>
                    <span className="font-bold text-[#F0EBDD]">{weather.current.precipitation} mm</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Field Planning Context */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border-l-2 border-l-[#294C36] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-serif font-bold text-[#D4BE8D] uppercase tracking-wider">
                      Foliage Spray Window
                    </span>
                    <Badge
                      variant={
                        weather.agriAdvisory.sprayingCondition === "Optimal"
                          ? "success"
                          : weather.agriAdvisory.sprayingCondition === "Caution"
                          ? "warning"
                          : "danger"
                      }
                    >
                      {weather.agriAdvisory.sprayingCondition}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#A5AA96] leading-relaxed">
                    {weather.agriAdvisory.sprayingReason}
                  </p>
                </div>
                <span className="text-[10px] text-[#A5AA96]/80 mt-3 block font-mono">
                  Drift limit: &lt;15 km/h &amp; dry canopy
                </span>
              </Card>

              <Card className="border-l-2 border-l-[#2563EB] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-serif font-bold text-[#93C5FD] uppercase tracking-wider">
                      Irrigation Protocol
                    </span>
                    <Badge variant="info">
                      {weather.agriAdvisory.irrigationNeed}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#A5AA96] leading-relaxed">
                    {weather.agriAdvisory.irrigationReason}
                  </p>
                </div>
                <span className="text-[10px] text-[#A5AA96]/80 mt-3 block font-mono">
                  Conserves groundwater and energy cost
                </span>
              </Card>

              <Card className="border-l-2 border-l-[#79563C] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-serif font-bold text-[#D5BEA8] uppercase tracking-wider">
                      Harvest Feasibility
                    </span>
                    <Badge
                      variant={weather.agriAdvisory.harvestSafety === "Safe" ? "success" : "warning"}
                    >
                      {weather.agriAdvisory.harvestSafety}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#A5AA96] leading-relaxed">
                    {weather.agriAdvisory.harvestSafety === "Safe"
                      ? "Zero severe precipitation anticipated. Optimal timing for reaping and sun-curing grains."
                      : "Rainfall expected within 48-72 hours. Protect cut produce under tarpaulins."}
                  </p>
                </div>
              </Card>

              <Card className="border-l-2 border-l-[#71805A] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-serif font-bold text-[#A4D5A4] uppercase tracking-wider">
                      Thermal Stress Index
                    </span>
                    <Badge
                      variant={weather.agriAdvisory.cropStressIndex === "Low" ? "success" : "warning"}
                    >
                      {weather.agriAdvisory.cropStressIndex}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#A5AA96] leading-relaxed">
                    Thermal and vapor pressure comfort zone calculated for regional field and plantation crops.
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* 7-Day Forecast Cards */}
          <div>
            <h3 className="text-xs font-serif font-bold text-[#D4BE8D] uppercase tracking-wider mb-3">
              7-Day Synoptic Forecast
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {weather.forecast.map((day) => (
                <Card key={day.date} className="text-center p-3.5 bg-[#18251D] border border-[#2D3B30] hover:border-[#B69A62]/40">
                  <span className="text-xs font-serif font-bold text-[#F0EBDD] block">{day.dayName}</span>
                  <span className="text-[10px] text-[#A5AA96] block mb-2 font-mono">{day.date.slice(5)}</span>

                  <CloudSun className="w-6 h-6 mx-auto text-[#B69A62] my-1" />

                  <div className="text-sm font-bold text-[#F0EBDD] mt-2 font-mono">
                    {day.tempMax}° / <span className="text-[#A5AA96] text-xs font-normal">{day.tempMin}°</span>
                  </div>

                  <div className="mt-2 text-[10px] text-[#A4D5A4] font-medium flex items-center justify-center gap-1 font-mono">
                    <Droplets className="w-3 h-3 text-[#71805A]" />
                    {day.precipitationSum} mm
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-xs font-serif font-bold text-[#D4BE8D] uppercase tracking-wider mb-4">
                7-Day Temperature Fluctuation Curve (°C)
              </h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="tempGradientDark" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#B69A62" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#B69A62" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2D3B30" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#A5AA96' }} stroke="#2D3B30" />
                    <YAxis unit="°" tick={{ fontSize: 11, fill: '#A5AA96' }} stroke="#2D3B30" domain={["dataMin - 2", "dataMax + 2"]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18251D",
                        borderColor: "#2D3B30",
                        borderRadius: "0.75rem",
                        color: "#F0EBDD",
                        fontSize: "12px"
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="maxTemp"
                      stroke="#B69A62"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#tempGradientDark)"
                      name="Max Temp (°C)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <h3 className="text-xs font-serif font-bold text-[#D4BE8D] uppercase tracking-wider mb-4">
                Forecasted Precipitation Volume (mm)
              </h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2D3B30" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#A5AA96' }} stroke="#2D3B30" />
                    <YAxis unit="mm" tick={{ fontSize: 11, fill: '#A5AA96' }} stroke="#2D3B30" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18251D",
                        borderColor: "#2D3B30",
                        borderRadius: "0.75rem",
                        color: "#F0EBDD",
                        fontSize: "12px"
                      }}
                    />
                    <Bar dataKey="rain" fill="#71805A" radius={[4, 4, 0, 0]} name="Rainfall (mm)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
};
