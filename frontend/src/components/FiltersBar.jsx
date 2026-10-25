import React from 'react';
import { Search, RotateCcw, Calendar } from 'lucide-react';

/**
 * Interactive filter toolbar.
 *
 * Allows real-time filtering of both aggregated charts and the activity journal:
 * - Debounced/live title search keyword
 * - Genre/Category dropdown (dynamically populated)
 * - Hardware platform dropdown (dynamically populated)
 * - Date range picker (start and end date bounds)
 * - Quick time-span presets (All Time, 30 Days, 90 Days, 180 Days)
 */
export default function FiltersBar({
  filters,
  onChange,
  onReset,
  categories = [],
  platforms = []
}) {
  const handleQuickDate = (days) => {
    if (days === null) {
      onChange({ startDate: '', endDate: '' });
      return;
    }
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    onChange({
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    });
  };

  return (
    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-md space-y-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search game title (e.g. Baldur's Gate, Cyberpunk)..."
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
        </div>

        {/* Dynamic Dropdowns & Date Selector */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          {/* Category Dropdown */}
          <div className="relative min-w-[140px] flex-1 sm:flex-initial">
            <select
              value={filters.category}
              onChange={(e) => onChange({ category: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition cursor-pointer appearance-none"
            >
              <option value="all">All Genres</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Platform Dropdown */}
          <div className="relative min-w-[140px] flex-1 sm:flex-initial">
            <select
              value={filters.platform}
              onChange={(e) => onChange({ platform: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition cursor-pointer appearance-none"
            >
              <option value="all">All Platforms</option>
              {platforms.map((plat) => (
                <option key={plat} value={plat}>
                  {plat}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Boundaries */}
          <div className="flex items-center space-x-1.5 bg-slate-800/80 border border-slate-700/80 rounded-xl px-2 py-1 text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="date"
              aria-label="Filter start date"
              value={filters.startDate}
              onChange={(e) => onChange({ startDate: e.target.value })}
              className="bg-transparent border-0 text-slate-200 focus:outline-none text-xs p-1"
            />
            <span className="text-slate-500">—</span>
            <input
              type="date"
              aria-label="Filter end date"
              value={filters.endDate}
              onChange={(e) => onChange({ endDate: e.target.value })}
              className="bg-transparent border-0 text-slate-200 focus:outline-none text-xs p-1"
            />
          </div>

          {/* Reset Action */}
          <button
            onClick={onReset}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 rounded-xl transition"
            title="Reset all active filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Date Presets */}
      <div className="flex items-center space-x-2 pt-1 border-t border-slate-800/60 text-xs">
        <span className="text-slate-500">Quick Range:</span>
        <button
          onClick={() => handleQuickDate(null)}
          className={`px-2 py-1 rounded-lg transition ${
            !filters.startDate && !filters.endDate
              ? 'bg-purple-900/40 text-purple-300 border border-purple-700/60'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          All Time
        </button>
        <button
          onClick={() => handleQuickDate(30)}
          className="px-2 py-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
        >
          30 Days
        </button>
        <button
          onClick={() => handleQuickDate(90)}
          className="px-2 py-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
        >
          90 Days
        </button>
        <button
          onClick={() => handleQuickDate(180)}
          className="px-2 py-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
        >
          6 Months
        </button>
      </div>
    </div>
  );
}
