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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#E5E8DD]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#202820] tracking-tight">
              Agronomic Weather & Forecast
            </h1>
            <Badge variant="leaf" size="sm">
              Open-Meteo Live
            </Badge>
          </div>
          <p className="text-xs text-[#788579] mt-1 font-medium">
            Real-time meteorological monitoring and agricultural field-spraying windows for Indian farmers.
          </p>
        </div>

        {/* Search bar & GPS Locate */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 md:w-72">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#788579] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search city, district, or state..."
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#DCE1D3] focus:outline-none focus:ring-2 focus:ring-[#174C35] bg-white text-[#202820]"
              />
            </div>
            <Button type="submit" size="sm">
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
            className="flex items-center gap-1.5 whitespace-nowrap"
          >
            <MapPin className="w-3.5 h-3.5 text-[#174C35]" />
            <span className="hidden sm:inline">Locate</span>
          </Button>
        </div>
      </div>

      {/* Quick Location Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[#788579] font-medium flex-shrink-0">Locations:</span>
        {selectedFarm && (
          <button
            onClick={() => {
              setGpsCoords(null);
              setActiveCity(selectedFarm.district || selectedFarm.name);
            }}
            className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 flex-shrink-0 transition-colors cursor-pointer ${
              !gpsCoords &&
              activeCity.toLowerCase() === (selectedFarm.district || selectedFarm.name).toLowerCase()
                ? "bg-[#174C35] text-white"
                : "bg-[#F0F6F3] text-[#174C35] hover:bg-[#E4F4E4]"
            }`}
          >
            <Tractor className="w-3 h-3" /> {selectedFarm.name}
          </button>
        )}
        {POPULAR_AGRI_DISTRICTS.map((dist) => (
          <button
            key={dist}
            onClick={() => {
              setGpsCoords(null);
              setActiveCity(dist);
            }}
            className={`px-2.5 py-1 rounded-md flex-shrink-0 transition-colors cursor-pointer ${
              !gpsCoords && activeCity.toLowerCase() === dist.toLowerCase()
                ? "bg-[#202820] text-white font-semibold"
                : "bg-white border border-[#E5E8DD] text-[#202820] hover:bg-[#F7F8F2]"
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
            <Card className="lg:col-span-5 bg-[#174C35] text-white border-[#123D2A]">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h3 className="font-bold text-base text-white">{weather.location.city}</h3>
                  <span className="text-xs text-[#DCE9E2]">
                    {weather.location.state ? `${weather.location.state}, ` : ""}
                    {weather.location.country}
                  </span>
                </div>
                <button
                  onClick={() => refetch()}
                  className={`p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ${
                    isFetching ? "animate-spin" : ""
                  }`}
                  title="Refresh weather data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <div className="py-6 flex items-baseline justify-between">
                <div>
                  <span className="text-5xl font-black tracking-tight">{weather.current.temperature}°C</span>
                  <span className="text-xs text-[#DCE9E2] block mt-1">
                    Feels like {weather.current.apparentTemperature}°C • {weather.current.weatherDescription}
                  </span>
                </div>
                <div className="text-right">
                  <CloudSun className="w-12 h-12 text-[#C7E7C7] ml-auto" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 text-xs">
                <div className="p-2.5 rounded-lg bg-white/10 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-[#C7E7C7]" />
                  <div>
                    <span className="text-[10px] text-[#DCE9E2] block">Humidity</span>
                    <span className="font-bold">{weather.current.humidity}%</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white/10 flex items-center gap-2">
                  <Wind className="w-4 h-4 text-[#C7E7C7]" />
                  <div>
                    <span className="text-[10px] text-[#DCE9E2] block">Wind</span>
                    <span className="font-bold">{weather.current.windSpeed} km/h</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white/10 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#C7E7C7]" />
                  <div>
                    <span className="text-[10px] text-[#DCE9E2] block">Precipitation</span>
                    <span className="font-bold">{weather.current.precipitation} mm</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Field Planning Context */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border-l-2 border-l-[#174C35] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#788579] uppercase tracking-wider">
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
                  <p className="text-xs text-[#202820] leading-relaxed">
                    {weather.agriAdvisory.sprayingReason}
                  </p>
                </div>
                <span className="text-[10px] text-[#788579] mt-3 block">
                  Evaluates wind drift (&lt;15 km/h) & imminent rain
                </span>
              </Card>

              <Card className="border-l-2 border-l-[#1D4ED8] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#788579] uppercase tracking-wider">
                      Irrigation Scheduling
                    </span>
                    <Badge variant="info">
                      {weather.agriAdvisory.irrigationNeed}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#202820] leading-relaxed">
                    {weather.agriAdvisory.irrigationReason}
                  </p>
                </div>
                <span className="text-[10px] text-[#788579] mt-3 block">
                  Prevents water runoff and pump power waste
                </span>
              </Card>

              <Card className="border-l-2 border-l-[#8B6548] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#788579] uppercase tracking-wider">
                      Harvest Safety
                    </span>
                    <Badge
                      variant={weather.agriAdvisory.harvestSafety === "Safe" ? "success" : "warning"}
                    >
                      {weather.agriAdvisory.harvestSafety}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#202820] leading-relaxed">
                    {weather.agriAdvisory.harvestSafety === "Safe"
                      ? "No heavy rain forecast. Favorable conditions for reaping and sun-drying grain."
                      : "Rain expected within 48-72 hours. Ensure harvested produce is stored under cover."}
                  </p>
                </div>
              </Card>

              <Card className="border-l-2 border-l-[#65A765] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#788579] uppercase tracking-wider">
                      Crop Stress Index
                    </span>
                    <Badge
                      variant={weather.agriAdvisory.cropStressIndex === "Low" ? "success" : "warning"}
                    >
                      {weather.agriAdvisory.cropStressIndex}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#202820] leading-relaxed">
                    Thermal and moisture comfort level for standard cereal and cash crops in this district.
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* 7-Day Forecast Cards */}
          <div>
            <h3 className="text-xs font-semibold text-[#788579] uppercase tracking-wider mb-3">
              7-Day Meteorological Forecast
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {weather.forecast.map((day) => (
                <Card key={day.date} className="text-center p-3">
                  <span className="text-xs font-semibold text-[#202820] block">{day.dayName}</span>
                  <span className="text-[10px] text-[#788579] block mb-2">{day.date.slice(5)}</span>

                  <CloudSun className="w-6 h-6 mx-auto text-[#174C35] my-1" />

                  <div className="text-sm font-bold text-[#202820] mt-2">
                    {day.tempMax}° / <span className="text-[#788579] text-xs font-normal">{day.tempMin}°</span>
                  </div>

                  <div className="mt-2 text-[10px] text-[#1D4ED8] font-medium flex items-center justify-center gap-1">
                    <Droplets className="w-3 h-3" />
                    {day.precipitationSum} mm
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-xs font-semibold text-[#788579] uppercase tracking-wider mb-4">
                7-Day Temperature Range (°C)
              </h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#174C35" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#174C35" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E8DD" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#788579' }} />
                    <YAxis unit="°" tick={{ fontSize: 11, fill: '#788579' }} domain={["dataMin - 2", "dataMax + 2"]} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="maxTemp"
                      stroke="#174C35"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#tempGradient)"
                      name="Max Temp (°C)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <h3 className="text-xs font-semibold text-[#788579] uppercase tracking-wider mb-4">
                Forecasted Precipitation Volume (mm)
              </h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E8DD" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#788579' }} />
                    <YAxis unit="mm" tick={{ fontSize: 11, fill: '#788579' }} />
                    <Tooltip />
                    <Bar dataKey="rain" fill="#65A765" radius={[4, 4, 0, 0]} name="Rainfall (mm)" />
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
