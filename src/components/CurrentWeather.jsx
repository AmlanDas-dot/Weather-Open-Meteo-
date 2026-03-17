/**
 * CurrentWeather.jsx
 * ──────────────────
 * Hero card: current conditions with enhanced glassmorphism UI.
 */

import useWeather from '../hooks/useWeather';
import { iconUrl } from '../services/weatherApi';
import { formatFullDate } from '../utils/formatDate';

const CurrentWeather = () => {
  const { currentWeather, unit } = useWeather();
  if (!currentWeather) return null;

  const deg = unit === 'metric' ? '°C' : '°F';

  return (
    <div className="animate-fade-in rounded-3xl p-6 md:p-8 bg-white/10 backdrop-blur-xl
                    shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/10">
      {/* City + date */}
      <div className="mb-5">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight" id="current-city">
          {currentWeather.city}, {currentWeather.country}
        </h2>
        <p className="text-sm opacity-60 mt-0.5">
          {formatFullDate(Math.floor(Date.now() / 1000))}
        </p>
      </div>

      {/* Hero row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
        <div className="flex items-center gap-4">
          <img
            src={iconUrl(currentWeather.icon, '4x')}
            alt={currentWeather.description}
            className="w-28 h-28 md:w-36 md:h-36 drop-shadow-2xl -ml-3"
          />
          <div>
            <p className="text-6xl md:text-8xl font-extrabold leading-none tracking-tighter" id="current-temp">
              {currentWeather.temp}<span className="text-3xl md:text-4xl font-semibold opacity-70">{deg}</span>
            </p>
            <p className="capitalize text-lg mt-1.5 opacity-80 font-medium">
              {currentWeather.description}
            </p>
            <p className="text-sm opacity-50 mt-0.5">
              Feels like {currentWeather.feelsLike}{deg}  ·  H:{currentWeather.tempMax}{deg}  L:{currentWeather.tempMin}{deg}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CurrentWeather;
