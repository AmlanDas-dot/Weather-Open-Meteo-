/**
 * App.jsx
 * ───────
 * Root application component.
 * Wraps the Dashboard with the WeatherProvider context.
 */

import { WeatherProvider } from './context/WeatherContext';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <WeatherProvider>
      <Dashboard />
    </WeatherProvider>
  );
}

export default App;
