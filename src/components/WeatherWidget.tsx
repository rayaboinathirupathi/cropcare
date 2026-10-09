'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n';
import { WeatherSummary } from '@/types';
import { INDIAN_DISTRICTS } from '@/data/indianDistricts';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  Thermometer, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  MapPin,
  RefreshCw 
} from 'lucide-react';

interface WeatherWidgetProps {
  initialDistrict?: string;
  compact?: boolean;
}

export function WeatherWidget({ initialDistrict = 'Warangal', compact = false }: WeatherWidgetProps) {
  const { dict, formatNumber } = useI18n();

  const [district, setDistrict] = useState<string>(initialDistrict);
  const [weather, setWeather] = useState<WeatherSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (distName: string) => {
    setLoading(true);
    setError(null);
    try {
      const d = INDIAN_DISTRICTS.find(item => item.name === distName) || INDIAN_DISTRICTS[0];
      const res = await fetch(`/api/weather?lat=${d.latitude}&lon=${d.longitude}&district=${encodeURIComponent(d.name)}`);
      if (!res.ok) throw new Error('Weather data unavailable');
      const data: WeatherSummary = await res.json();
      setWeather(data);
    } catch (err) {
      setError('Unable to load weather forecast');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(district);
  }, [district]);

  // Request browser geolocation if user taps "Detect My Location"
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`/api/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&district=Current+GPS+Location`);
          if (!res.ok) throw new Error();
          const data = await res.json();
          setWeather(data);
          setDistrict('Current GPS Location');
        } catch {
          setError('Could not fetch weather for your GPS coordinates');
        } finally {
          setLoading(false);
        }
      },
      (geoErr) => {
        setLoading(false);
        alert(dict.errors.locationDenied);
      },
      { timeout: 10000 }
    );
  };

  if (compact) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-agri-600" />
              <span>{weather?.locationName || district}</span>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
              <span>{weather?.temperatureC ?? '--'}°C</span>
              <span>•</span>
              <span>RH {weather?.humidityPercent ?? '--'}%</span>
            </div>
          </div>
        </div>

        {weather && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            weather.agriculturalIndices.sprayingCondition === 'favorable'
              ? 'bg-emerald-100 text-emerald-800'
              : weather.agriculturalIndices.sprayingCondition === 'marginal'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {weather.agriculturalIndices.sprayingCondition.toUpperCase()} SPRAY
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs">
      {/* Header bar with location switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-agri-600" />
            {dict.weather.title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {dict.weather.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="text-xs font-semibold border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-800"
          >
            {INDIAN_DISTRICTS.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name} ({d.state})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleDetectLocation}
            className="text-xs font-medium bg-agri-100 hover:bg-agri-200 text-agri-800 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            title="Use phone GPS"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">GPS</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-agri-600" />
          <span className="text-xs font-medium">Fetching agromet weather parameters...</span>
        </div>
      ) : weather ? (
        <div className="mt-4 space-y-5">
          {/* Main Current Conditions grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-orange-600" />
                {dict.weather.currentTemp}
              </span>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {formatNumber(weather.temperatureC)}°C
              </p>
              <span className="text-[10px] text-slate-500">{weather.weatherConditionText}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-blue-600" />
                {dict.weather.humidity}
              </span>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {formatNumber(weather.humidityPercent)}%
              </p>
              <span className="text-[10px] text-slate-500">Relative Humidity</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-teal-600" />
                {dict.weather.windSpeed}
              </span>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {formatNumber(weather.windSpeedKmH)} <span className="text-xs font-normal">km/h</span>
              </p>
              <span className="text-[10px] text-slate-500">Surface Wind</span>
            </div>

            {/* Spraying window status */}
            <div className={`p-3 rounded-xl border ${
              weather.agriculturalIndices.sprayingCondition === 'favorable'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : weather.agriculturalIndices.sprayingCondition === 'marginal'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}>
              <span className="text-[11px] font-bold uppercase tracking-wider block">
                {dict.weather.sprayFeasibility}
              </span>
              <div className="flex items-center gap-1.5 mt-1 font-extrabold text-sm">
                {weather.agriculturalIndices.sprayingCondition === 'favorable' ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>{dict.weather.sprayFavorable}</span>
                  </>
                ) : weather.agriculturalIndices.sprayingCondition === 'marginal' ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>{dict.weather.sprayMarginal}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span>{dict.weather.sprayUnfavorable}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Specific Spraying Advisory */}
          <div className="p-3 bg-agri-50 border border-agri-200 rounded-xl text-xs text-agri-900 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-agri-700 shrink-0 mt-0.5" />
            <p>
              <strong>Agronomist Spraying Notice:</strong> {weather.agriculturalIndices.sprayingAdvice}
            </p>
          </div>

          {/* Agricultural Disease Risk Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-700 block">
                  {dict.weather.fungalRisk}
                </span>
                <span className="text-[11px] text-slate-500">
                  Driven by humidity & leaf wetness duration
                </span>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg uppercase ${
                weather.agriculturalIndices.fungalDiseaseRisk === 'high'
                  ? 'bg-red-100 text-red-800'
                  : weather.agriculturalIndices.fungalDiseaseRisk === 'moderate'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {weather.agriculturalIndices.fungalDiseaseRisk}
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-700 block">
                  {dict.weather.pestRisk}
                </span>
                <span className="text-[11px] text-slate-500">
                  Whitefly / Thrips / Bollworm surge condition
                </span>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg uppercase ${
                weather.agriculturalIndices.pestSurgeRisk === 'high'
                  ? 'bg-red-100 text-red-800'
                  : weather.agriculturalIndices.pestSurgeRisk === 'moderate'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {weather.agriculturalIndices.pestSurgeRisk}
              </span>
            </div>
          </div>

          {/* 7-Day Forecast Row */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {dict.weather.forecastTitle}
            </h4>
            <div className="grid grid-cols-7 gap-1.5 overflow-x-auto text-center">
              {weather.forecastDaily.map((day, idx) => (
                <div key={idx} className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs min-w-[50px]">
                  <span className="text-[10px] text-slate-500 font-semibold block">
                    {idx === 0 ? 'Today' : new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                  </span>
                  <div className="font-bold text-slate-800 my-1">
                    {Math.round(day.tempMax)}°
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {Math.round(day.tempMin)}°
                  </div>
                  <div className="text-[9px] text-blue-600 font-medium mt-1">
                    {day.precipitationProbability}% 🌧
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-slate-400 text-right">
            {dict.weather.sourceLabel} • Last updated: {new Date(weather.timestamp).toLocaleTimeString()}
          </div>
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-red-600">
          {error || 'Unable to load weather forecast.'}
        </div>
      )}
    </div>
  );
}
