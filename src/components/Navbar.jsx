/**
 * Navbar.jsx
 * ──────────
 * Top navigation: branding, search, and temperature toggle.
 * Stacking context set to ensure search dropdown always on top.
 */

import { WiDaySunny } from 'react-icons/wi';
import SearchBar from './SearchBar';
import TemperatureToggle from './TemperatureToggle';

const Navbar = () => (
  <nav className="relative w-full flex flex-col sm:flex-row items-center justify-between gap-4
                  px-5 py-3.5 backdrop-blur-xl bg-white/[0.08] rounded-2xl
                  shadow-[0_4px_24px_rgba(0,0,0,0.1)] border border-white/10"
       style={{ zIndex: 1000 }}
  >
    {/* Brand */}
    <div className="flex items-center gap-2.5 shrink-0">
      <WiDaySunny className="text-3xl text-yellow-300 drop-shadow-lg" />
      <h1 className="text-xl font-bold tracking-tight">
        Weather<span className="font-light opacity-80">Dashboard</span>
      </h1>
    </div>

    {/* Search */}
    <div className="w-full sm:max-w-md">
      <SearchBar />
    </div>

    {/* Toggle */}
    <TemperatureToggle />
  </nav>
);

export default Navbar;
