/**
 * HourlyForecast.jsx
 * ──────────────────
 * Scrollable 24-hour carousel. Times come from API data.
 */

import useWeather from '../hooks/useWeather';
import { iconUrl } from '../services/weatherApi';
import { formatHour } from '../utils/formatDate';

const HourlyForecast = () => {
  const { hourlyForecast, unit } = useWeather();
  if (!hourlyForecast?.length) return null;

  const deg = unit === 'metric' ? '°' : '°';

  return (
    <div className="animate-slide-up rounded-3xl p-5 bg-white/10 backdrop-blur-xl
                    shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/10">
      <h3 className="text-lg font-semibold mb-3">Hourly Forecast</h3>

      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide" id="hourly-scroll">
        {hourlyForecast.map((h, i) => (
          <div
            key={h.time}
            className="flex flex-col items-center shrink-0 rounded-2xl
                       bg-white/[0.08] hover:bg-white/[0.16]
                       px-3.5 py-3 min-w-[76px] transition-all
                       hover:scale-[1.04] cursor-default"
          >
            <span className="text-[11px] opacity-60 font-medium whitespace-nowrap">
              {i === 0 ? 'Now' : formatHour(h.time)}
            </span>
            <img
              src={iconUrl(h.icon)}
              alt={h.description}
              className="w-9 h-9 my-1 drop-shadow"
            />
            <span className="text-sm font-bold">
              {h.temp}{deg}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
