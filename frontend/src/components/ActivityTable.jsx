import React from 'react';
import { Star, Trash2, ChevronLeft, ChevronRight, ListOrdered } from 'lucide-react';

/**
 * Tabular Activity Journal.
 *
 * Displays individual gaming sessions with:
 * - Session date & title
 * - Stylized genre tag
 * - Hardware platform
 * - Duration & financial expenditure
 * - User enjoyment rating
 * - User notes
 * - Row deletion trigger and server-side pagination controls
 */
export default function ActivityTable({
  activities,
  total,
  skip,
  limit,
  onPageChange,
  onDelete
}) {
  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(total / limit) || 1;

  const getCategoryBadgeClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'rpg':
      case 'action rpg':
        return 'bg-purple-950/60 text-purple-300 border-purple-800';
      case 'shooter':
        return 'bg-red-950/60 text-red-300 border-red-800';
      case 'strategy':
        return 'bg-blue-950/60 text-blue-300 border-blue-800';
      case 'indie roguelike':
      case 'indie':
        return 'bg-pink-950/60 text-pink-300 border-pink-800';
      case 'simulation':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-800';
      case 'racing':
        return 'bg-amber-950/60 text-amber-300 border-amber-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <ListOrdered className="w-4 h-4" />
          </div>
          <h3 className="text-base font-semibold text-white">Activity Journal</h3>
        </div>
        <span className="text-xs text-slate-400">
          Total Records: <strong className="text-white">{total}</strong>
        </span>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800/60 text-xs uppercase text-slate-400 border-b border-slate-700/60">
            <tr>
              <th scope="col" className="px-4 py-3 rounded-l-lg">Date</th>
              <th scope="col" className="px-4 py-3">Title / Activity</th>
              <th scope="col" className="px-4 py-3">Genre</th>
              <th scope="col" className="px-4 py-3">Platform</th>
              <th scope="col" className="px-4 py-3 text-right">Duration</th>
              <th scope="col" className="px-4 py-3 text-right">Cost</th>
              <th scope="col" className="px-4 py-3 text-center">Score</th>
              <th scope="col" className="px-4 py-3">Notes</th>
              <th scope="col" className="px-4 py-3 text-center rounded-r-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {activities.length > 0 ? (
              activities.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition">
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-400">
                    {item.date}
                  </td>
                  <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                    {item.title}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-xs rounded-full border ${getCategoryBadgeClass(
                        item.category
                      )}`}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-400">
                    {item.platform}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right font-semibold text-indigo-400">
                    {item.hours_played} hrs
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-xs">
                    {item.money_spent > 0 ? (
                      <span className="text-emerald-400 font-medium">
                        ${item.money_spent.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-xs">
                    {item.rating ? (
                      <span className="inline-flex items-center text-amber-400 font-medium">
                        <Star className="w-3.5 h-3.5 mr-1 fill-amber-400" />
                        {item.rating}
                      </span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 max-w-xs truncate" title={item.notes || ''}>
                    {item.notes || <span className="text-slate-600">—</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-950/40 rounded transition"
                      title="Delete activity record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-4 py-8 text-center text-slate-500 text-sm">
                  No activity records found. Upload a dataset or add a session manually.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {total > 0 && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
          <div>
            Showing {skip + 1}–{Math.min(skip + limit, total)} of {total}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(Math.max(0, skip - limit))}
              disabled={skip === 0}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-850 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(skip + limit)}
              disabled={skip + limit >= total}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-850 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
