/**
 * TemperatureToggle.jsx
 * ─────────────────────
 * Styled pill toggle between °C and °F.
 */

import useWeather from '../hooks/useWeather';

const TemperatureToggle = () => {
  const { unit, toggleUnit } = useWeather();
  const isMetric = unit === 'metric';

  return (
    <button
      onClick={toggleUnit}
      className="relative flex items-center gap-0 rounded-full bg-white/10 hover:bg-white/20
                 transition-all p-0.5 shrink-0 border border-white/10"
      aria-label="Toggle temperature unit"
      id="temp-unit-toggle"
    >
      <span
        className={`relative z-10 px-3 py-1.5 rounded-full text-sm font-semibold transition-all
          ${isMetric ? 'bg-white/20 text-white shadow-lg' : 'text-white/40'}`}
      >
        °C
      </span>
      <span
        className={`relative z-10 px-3 py-1.5 rounded-full text-sm font-semibold transition-all
          ${!isMetric ? 'bg-white/20 text-white shadow-lg' : 'text-white/40'}`}
      >
        °F
      </span>
    </button>
  );
};

export default TemperatureToggle;
