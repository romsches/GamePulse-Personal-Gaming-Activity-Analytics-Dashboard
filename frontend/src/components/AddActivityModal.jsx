import React, { useState } from 'react';
import { PlusCircle, X, AlertCircle } from 'lucide-react';

/**
 * Manual Activity Creation Modal.
 *
 * Allows users to register standalone play sessions, DLC expansions, or hardware/game purchases.
 */
export default function AddActivityModal({ isOpen, onClose, onAddActivity }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'RPG',
    platform: 'PC',
    date: new Date().toISOString().split('T')[0],
    hours_played: 2.0,
    money_spent: 0.0,
    rating: 8.5,
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title cannot be empty');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onAddActivity({
        ...formData,
        hours_played: parseFloat(formData.hours_played) || 0,
        money_spent: parseFloat(formData.money_spent) || 0,
        rating: formData.rating ? parseFloat(formData.rating) : null
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save activity record');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">New Activity Entry</h3>
            <p className="text-xs text-slate-400">Log a gaming session, achievement, or purchase</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-800 rounded-xl flex items-center space-x-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Game / Activity Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Cyberpunk 2077"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Genre / Category *
              </label>
              <input
                type="text"
                required
                placeholder="RPG, Action, Shooter..."
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Hardware Platform *
              </label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                <option value="PC">PC / Steam</option>
                <option value="PS5">PlayStation 5</option>
                <option value="Xbox Series X">Xbox Series X</option>
                <option value="Nintendo Switch">Nintendo Switch</option>
                <option value="Mobile">Mobile (iOS / Android)</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Duration (hours) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="48"
                required
                value={formData.hours_played}
                onChange={(e) => setFormData({ ...formData, hours_played: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Cost ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.money_spent}
                onChange={(e) => setFormData({ ...formData, money_spent: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Score Rating (1.0 - 10.0)
            </label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="10"
              value={formData.rating || ''}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              placeholder="e.g. 9.5"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Notes & Highlights
            </label>
            <textarea
              rows="2"
              placeholder="Boss defeated, quest progression, memorable moments..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 rounded-xl shadow-lg shadow-purple-600/20 transition"
            >
              {submitting ? 'Saving...' : 'Add Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
