import React from 'react';
import { Clock, Wallet, Trophy, Tag, Gamepad } from 'lucide-react';

/**
 * Top-level KPI metric cards.
 *
 * Displays aggregated statistical indicators:
 * - Total Gameplay Hours & 24h day equivalent
 * - Total Expenditure & unit cost per hour ($/hr)
 * - Top Played Title by hours
 * - Primary Genre / Category by playtime
 * - Distinct Games Count & Total Sessions
 */
export default function KpiCards({ kpis }) {
  if (!kpis) return null;

  const cards = [
    {
      title: 'Total Playtime',
      value: `${kpis.total_hours.toFixed(1)} hrs`,
      subtext: `${(kpis.total_hours / 24).toFixed(1)} pure days of gaming`,
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      textColor: 'text-blue-400'
    },
    {
      title: 'Total Spending',
      value: `$${kpis.total_spent.toFixed(2)}`,
      subtext: `$${kpis.avg_cost_per_hour.toFixed(2)} / gameplay hour`,
      icon: Wallet,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      textColor: 'text-emerald-400'
    },
    {
      title: 'Top Game',
      value: kpis.top_game || 'No Data',
      subtext: 'By cumulative hours',
      icon: Trophy,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      textColor: 'text-amber-400'
    },
    {
      title: 'Favorite Genre',
      value: kpis.top_category || 'No Data',
      subtext: 'Highest playtime share',
      icon: Tag,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      textColor: 'text-purple-400'
    },
    {
      title: 'Catalog & Activity',
      value: `${kpis.unique_games} games`,
      subtext: `${kpis.total_activities} sessions across ${kpis.total_days_active} days`,
      icon: Gamepad,
      color: 'from-indigo-500 to-violet-500',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20',
      textColor: 'text-indigo-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl bg-slate-900/60 border ${card.borderColor} backdrop-blur-sm shadow-lg flex flex-col justify-between transition-all hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl ${card.bgColor} ${card.textColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xl font-bold text-white tracking-tight truncate" title={card.value}>
                {card.value}
              </div>
              <p className="text-xs text-slate-400 mt-1 truncate">
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
