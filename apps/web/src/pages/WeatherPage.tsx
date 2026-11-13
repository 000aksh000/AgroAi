import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  CloudSun,
  Search,
  Droplets,
  Wind,
  Compass,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Tractor,
  MapPin,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useFarm } from '../context/FarmContext';
import { apiClient } from '../api/client';
import { IWeatherData } from '@agrosmart/shared-types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';

const POPULAR_AGRI_DISTRICTS = [
  'Delhi',
  'Ambedkar Nagar',
  'Lucknow',
  'Varanasi',
  'Ludhiana',
  'Pune',
  'Nashik',
  'Karnal',
  'Patna',
  'Indore',
  'Jaipur',
  'Ahmedabad',
];

export const WeatherPage: React.FC = () => {
  const { selectedFarm } = useFarm();
  const [cityInput, setCityInput] = useState('');
  const [activeCity, setActiveCity] = useState<string>(
    selectedFarm?.district || selectedFarm?.state || 'Delhi'
  );
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const { data: weather, isLoading, refetch, isFetching } = useQuery<IWeatherData>({
    queryKey: ['weather-full', activeCity, gpsCoords, selectedFarm?.id],
    queryFn: async () => {
      const params: any = {};
      if (gpsCoords) {
        params.latitude = gpsCoords.lat;
        params.longitude = gpsCoords.lon;
      } else if (activeCity) {
        params.city = activeCity;
      } else if (selectedFarm?.district) {
        params.city = selectedFarm.district;
      } else {
        params.city = 'Delhi';
      }
      const res = await apiClient.get('/weather', { params });
      return res.data.data;
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (cityInput.trim()) {
      setGpsCoords(null);
      setActiveCity(cityInput.trim());
    }
  };

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setActiveCity('');
        setGpsCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      (err) => {
        setIsLocating(false);
        alert('Could not access your location. Please check browser permissions or search by city name.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const chartData = (weather?.forecast || []).map((f) => ({
    name: f.dayName,
    maxTemp: f.tempMax,
    minTemp: f.tempMin,
    rain: f.precipitationSum,
    prob: f.precipitationProbability,
  }));

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Agronomic Weather & Forecast
            </h1>
            <Badge variant="info" size="sm">Open-Meteo Live</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time meteorological monitoring and agricultural field-spraying windows for Indian farmers.
          </p>
        </div>

        {/* Search bar & GPS Locate */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 md:w-72">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search city, district, or state (e.g. UP, Delhi)"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500"
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
            className="flex items-center gap-1.5 whitespace-nowrap bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Locate Me</span>
          </Button>
        </div>
      </div>

      {/* Quick Location Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-semibold flex-shrink-0">Quick Locations:</span>
        {selectedFarm && (
          <button
            onClick={() => {
              setGpsCoords(null);
              setActiveCity(selectedFarm.district || selectedFarm.name);
            }}
            className={`px-2.5 py-1 rounded-full font-bold flex items-center gap-1 flex-shrink-0 transition-colors ${
              !gpsCoords &&
              activeCity.toLowerCase() === (selectedFarm.district || selectedFarm.name).toLowerCase()
                ? 'bg-agri-700 text-white shadow-sm'
                : 'bg-agri-100 text-agri-800 hover:bg-agri-200'
            }`}
          >
            <Tractor className="w-3 h-3" /> Active Farm: {selectedFarm.name} ({selectedFarm.district || selectedFarm.state})
          </button>
        )}
        {POPULAR_AGRI_DISTRICTS.map((dist) => (
          <button
            key={dist}
            onClick={() => {
              setGpsCoords(null);
              setActiveCity(dist);
            }}
            className={`px-2.5 py-1 rounded-full flex-shrink-0 transition-colors ${
              !gpsCoords && activeCity.toLowerCase() === dist.toLowerCase()
                ? 'bg-slate-900 text-white font-semibold shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
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
            {/* Current Weather (5 cols) */}
            <Card className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-base text-white">{weather.location.city}</h3>
                  <span className="text-xs text-slate-400">
                    {weather.location.state ? `${weather.location.state}, ` : ''}{weather.location.country}
                  </span>
                </div>
                <button
                  onClick={() => refetch()}
                  className={`p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
                    isFetching ? 'animate-spin' : ''
                  }`}
                  title="Refresh weather data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <div className="py-6 flex items-baseline justify-between">
                <div>
                  <span className="text-5xl font-black tracking-tight">{weather.current.temperature}°C</span>
                  <span className="text-xs text-slate-400 block mt-1">
                    Feels like {weather.current.apparentTemperature}°C • {weather.current.weatherDescription}
                  </span>
                </div>
                <div className="text-right">
                  <CloudSun className="w-14 h-14 text-amber-400 ml-auto" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800/80 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800/60 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Humidity</span>
                    <span className="font-bold">{weather.current.humidity}%</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/60 flex items-center gap-2">
                  <Wind className="w-4 h-4 text-teal-400" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Wind</span>
                    <span className="font-bold">{weather.current.windSpeed} km/h</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/60 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-purple-400" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Precipitation</span>
                    <span className="font-bold">{weather.current.precipitation} mm</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Field Planning Context (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border-l-4 border-l-agri-600 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Foliage Spray Window
                    </span>
                    <Badge
                      variant={
                        weather.agriAdvisory.sprayingCondition === 'Optimal'
                          ? 'success'
                          : weather.agriAdvisory.sprayingCondition === 'Caution'
                          ? 'warning'
                          : 'danger'
                      }
                    >
                      {weather.agriAdvisory.sprayingCondition}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {weather.agriAdvisory.sprayingReason}
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 mt-3 block">
                  Evaluates wind drift (&lt;15 km/h) & imminent rainfall
                </span>
              </Card>

              <Card className="border-l-4 border-l-blue-600 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Irrigation Scheduling
                    </span>
                    <Badge variant="info">
                      {weather.agriAdvisory.irrigationNeed}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {weather.agriAdvisory.irrigationReason}
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 mt-3 block">
                  Prevents water runoff and pumping energy waste
                </span>
              </Card>

              <Card className="border-l-4 border-l-amber-600 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Harvest Safety
                    </span>
                    <Badge
                      variant={
                        weather.agriAdvisory.harvestSafety === 'Safe' ? 'success' : 'warning'
                      }
                    >
                      {weather.agriAdvisory.harvestSafety}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {weather.agriAdvisory.harvestSafety === 'Safe'
                      ? 'No heavy rainfall forecast. Favorable conditions for reaping and sun-drying grain.'
                      : 'Rain expected within 48-72 hours. Ensure harvested produce is stored under cover.'}
                  </p>
                </div>
              </Card>

              <Card className="border-l-4 border-l-rose-600 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Crop Stress Index
                    </span>
                    <Badge
                      variant={
                        weather.agriAdvisory.cropStressIndex === 'Low' ? 'success' : 'warning'
                      }
                    >
                      {weather.agriAdvisory.cropStressIndex}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Thermal and moisture comfort level for standard cereal and horticulture crops in this district.
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* 7-Day Forecast Cards */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              7-Day Meteorological Forecast
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {weather.forecast.map((day) => (
                <Card key={day.date} className="text-center p-3">
                  <span className="text-xs font-bold text-slate-800 block">{day.dayName}</span>
                  <span className="text-[10px] text-slate-400 block mb-2">{day.date.slice(5)}</span>

                  <CloudSun className="w-8 h-8 mx-auto text-amber-500 my-1" />

                  <div className="text-sm font-extrabold text-slate-900 mt-2">
                    {day.tempMax}° / <span className="text-slate-400 text-xs font-normal">{day.tempMin}°</span>
                  </div>

                  <div className="mt-2 text-[10px] text-blue-600 font-semibold flex items-center justify-center gap-1">
                    <Droplets className="w-3 h-3" />
                    {day.precipitationSum} mm ({day.precipitationProbability}%)
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Recharts Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
                7-Day Temperature Range (°C)
              </h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis unit="°" tick={{ fontSize: 11 }} domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="maxTemp"
                      stroke="#16a34a"
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
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
                Forecasted Precipitation Volume (mm)
              </h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis unit="mm" tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="rain" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Rainfall (mm)" />
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
