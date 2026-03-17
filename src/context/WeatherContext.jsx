/**
 * WeatherContext.jsx
 * ──────────────────
 * Global state for weather data, forecast, air quality, user preferences,
 * loading, and error states. Consumed via the useWeather hook.
 * Added 10-minute caching to localStorage.
 */

import { createContext, useState, useEffect, useCallback } from 'react';
import {
  fetchCurrentWeatherByCoords,
  fetchForecast,
  fetchAirQuality,
  fetchCityCoordinates,
} from '../services/weatherApi';

export const WeatherContext = createContext();

const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

/** Read from localStorage safely */
const readLS = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

export const WeatherProvider = ({ children }) => {
  /* ─── state ─── */
  const [city, setCity] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [dailyForecast, setDailyForecast] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [unit, setUnit] = useState(() => readLS('temperatureUnit', 'metric'));
  const [recentCities, setRecentCities] = useState(() => readLS('recentCities', []));

  /* ─── persist units/recent ─── */
  useEffect(() => {
    localStorage.setItem('temperatureUnit', JSON.stringify(unit));
  }, [unit]);

  useEffect(() => {
    localStorage.setItem('recentCities', JSON.stringify(recentCities));
  }, [recentCities]);

  /* ─── recent cities (max 5) ─── */
  const addRecentCity = useCallback((name) => {
    setRecentCities((prev) => {
      const filtered = prev.filter((c) => c.toLowerCase() !== name.toLowerCase());
      return [name, ...filtered].slice(0, 5);
    });
  }, []);

  const clearRecentCities = useCallback(() => setRecentCities([]), []);

  /* ─── caching mechanism ─── */
  const getCache = (lat, lon, u) => {
    const key = `weather_cache_${lat.toFixed(2)}_${lon.toFixed(2)}_${u}`;
    const cached = readLS(key, null);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
      return cached.data;
    }
    return null;
  };

  const setCache = (lat, lon, u, data) => {
    const key = `weather_cache_${lat.toFixed(2)}_${lon.toFixed(2)}_${u}`;
    localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
  };

  /* ─── fetch by coords ─── */
  const fetchWeatherByCoords = useCallback(
    async (lat, lon, resolvedLocation = {}) => {
      setLoading(true);
      setError(null);
      try {
        const cached = getCache(lat, lon, unit);
        if (cached) {
          setCurrentWeather(cached.currentWeather);
          setHourlyForecast(cached.hourlyForecast);
          setDailyForecast(cached.dailyForecast);
          setAirQuality(cached.airQuality);
          setCity(cached.currentWeather.city);
          addRecentCity(cached.currentWeather.city);
          setLoading(false);
          return;
        }

        // Fetch all in parallel using lat/lon
        const [current, forecast, aqi] = await Promise.all([
          fetchCurrentWeatherByCoords(
            lat,
            lon,
            unit,
            resolvedLocation.name || 'Your Location',
            resolvedLocation.country || '',
          ),
          fetchForecast(lat, lon, unit),
          fetchAirQuality(lat, lon),
        ]);

        const mergedCurrent = {
          ...current,
          uvi: forecast?.current?.uvi // attach UVI from forecast data
        };

        setCurrentWeather(mergedCurrent);
        setHourlyForecast(forecast.hourly);
        setDailyForecast(forecast.daily);
        setAirQuality(aqi);
        setCity(mergedCurrent.city);
        addRecentCity(mergedCurrent.city);

        // Save to cache
        setCache(lat, lon, unit, {
          currentWeather: mergedCurrent,
          hourlyForecast: forecast.hourly,
          dailyForecast: forecast.daily,
          airQuality: aqi,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [unit, addRecentCity],
  );

  /* ─── fetch by city (Geocode then Coords) ─── */
  const fetchWeatherByCity = useCallback(
    async (cityName) => {
      setLoading(true);
      setError(null);
      try {
        const { lat, lon, name, country } = await fetchCityCoordinates(cityName);
        await fetchWeatherByCoords(lat, lon, { name, country });
        // Ensure city name is exactly what geocode matched
        setCity(name);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    },
    [fetchWeatherByCoords],
  );

  /* ─── toggle unit ─── */
  const toggleUnit = useCallback(() => {
    setUnit((prev) => (prev === 'metric' ? 'imperial' : 'metric'));
  }, []);

  // Re-fetch when unit changes
  useEffect(() => {
    if (city) fetchWeatherByCity(city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  /* ─── initial load (Fallback to Delhi if geolocation fails) ─── */
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeatherByCity('Delhi'), // Fallback to Delhi
      );
    } else {
      fetchWeatherByCity('Delhi'); // Fallback to Delhi
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WeatherContext.Provider
      value={{
        city,
        currentWeather,
        hourlyForecast,
        dailyForecast,
        airQuality,
        loading,
        error,
        unit,
        recentCities,
        fetchWeatherByCity,
        fetchWeatherByCoords,
        toggleUnit,
        clearRecentCities,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};
