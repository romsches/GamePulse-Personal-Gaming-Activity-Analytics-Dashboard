import React from 'react';
import { Gamepad2, UploadCloud, PlusCircle, Trash2, Sparkles } from 'lucide-react';

/**
 * Global application navigation header.
 *
 * Provides brand identity and primary control triggers:
 * - One-click pre-seeded demo dataset loader
 * - CSV/JSON dataset file upload modal trigger
 * - Manual activity entry modal trigger
 * - Database reset/clear trigger
 */
export default function Navbar({
  onOpenUpload,
  onOpenAdd,
  onLoadSample,
  onClearAll,
  isClearing,
  isLoadingSample
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-purple-600 to-indigo-500 rounded-xl shadow-lg shadow-purple-500/20 text-white">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300">
                  GamePulse
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-800">
                  Analytics
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Personal Gaming & Activity Intelligence Platform
              </p>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onLoadSample}
              disabled={isLoadingSample}
              className="inline-flex items-center px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-indigo-300 bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-800 transition shadow-sm disabled:opacity-50"
              title="Populate dashboard with realistic pre-seeded dataset"
            >
              <Sparkles className="w-4 h-4 mr-1.5 text-indigo-400" />
              <span>{isLoadingSample ? 'Loading Demo...' : 'Demo Data'}</span>
            </button>

            <button
              onClick={onOpenUpload}
              className="inline-flex items-center px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-purple-300 bg-purple-950/50 hover:bg-purple-900/60 border border-purple-800 transition shadow-sm"
              title="Upload custom CSV or JSON dataset"
            >
              <UploadCloud className="w-4 h-4 mr-1.5 text-purple-400" />
              <span>Upload Dataset</span>
            </button>

            <button
              onClick={onOpenAdd}
              className="inline-flex items-center px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/20 transition"
              title="Add activity session manually"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Add Session</span>
            </button>

            <button
              onClick={onClearAll}
              disabled={isClearing}
              className="inline-flex items-center p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg border border-transparent hover:border-red-900/40 transition disabled:opacity-50"
              title="Clear all stored activity records"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
