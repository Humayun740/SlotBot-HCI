import React from 'react';
import { useScheduler } from '../context/SchedulerContext';
import {
  Users,
  Lock,
  Columns,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Eye,
  CheckCircle2,
  FileCheck2
} from 'lucide-react';
import { format24To12 } from '../utils/transitLogic';

interface TopNavigationProps {
  onOpenSettings: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({ onOpenSettings }) => {
  const {
    viewMode,
    setViewMode,
    flowStage,
    scenarioPreset,
    loadScenario,
    resetAll,
    busCutoff,
    transitBufferMinutes,
    showEvaluatorGuide,
    setShowEvaluatorGuide,
    showGestaltOverlay,
    setShowGestaltOverlay
  } = useScheduler();

  const formattedCutoff = format24To12(busCutoff);

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-sm shrink-0">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            <h1 className="font-bold tracking-wide text-sm text-white">
              SlotBot <span className="text-slate-400 font-normal text-xs">| Deliverable D4 Part B</span>
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-700 text-slate-300">
            <span className="text-slate-400 font-mono text-[11px]">Bus Cutoff:</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 font-semibold text-emerald-300 font-mono text-[11px]">
              {formattedCutoff}
            </span>
            <span className="text-slate-400 font-mono text-[11px]">Buffer:</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 font-semibold text-emerald-300 font-mono text-[11px]">
              {transitBufferMinutes}m
            </span>
          </div>
        </div>

        {/* Quick Evaluator Tools */}
        <div className="flex items-center gap-2">
          {/* Gestalt Principles Toggle */}
          <button
            type="button"
            onClick={() => setShowGestaltOverlay(!showGestaltOverlay)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-400 ${
              showGestaltOverlay
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Toggle Gestalt Principles Annotations"
          >
            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Gestalt Labels</span>
          </button>

          {/* Evaluator Guide / 8-State Modal */}
          <button
            type="button"
            onClick={() => setShowEvaluatorGuide(true)}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-400"
            title="Open 8-State UI & WCAG Checklist"
          >
            <FileCheck2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>8-State & WCAG Guide</span>
          </button>

          {/* Commuter Settings */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-400"
            title="Configure Bus Departure & Transit Buffer"
          >
            <Sliders className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {/* Reset button */}
          <button
            type="button"
            onClick={resetAll}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-400"
            title="Reset to default prototype state"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Switcher Controls & Scenario Selector */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Core Requirement 1: Interactive View Switcher */}
        <nav
          aria-label="View Switcher"
          className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl w-full sm:w-auto"
        >
          <button
            type="button"
            onClick={() => setViewMode('group')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-emerald-400 ${
              viewMode === 'group'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Users className="w-4 h-4" aria-hidden="true" />
            <span>Group Chat (@SlotBot)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('bilal_dm')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-emerald-400 relative ${
              viewMode === 'bilal_dm'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Lock className="w-4 h-4" aria-hidden="true" />
            <span>Bilal's Private DM</span>
            {flowStage === 'collecting' && (
              <span
                className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute top-1.5 right-1.5"
                title="Pending availability declaration"
              />
            )}
          </button>

          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`hidden lg:flex px-3 py-1.5 rounded-lg font-bold text-xs transition-all items-center gap-2 focus-visible:ring-2 focus-visible:ring-emerald-400 ${
              viewMode === 'split'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
            title="Side-by-side evaluator split screen"
          >
            <Columns className="w-4 h-4" aria-hidden="true" />
            <span>Split View</span>
          </button>
        </nav>

        {/* Core Requirement 5: Scenario Simulation Control */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
          <span className="text-slate-400 font-medium hidden md:inline">Test Scenario:</span>

          {/* Happy Path button */}
          <button
            type="button"
            onClick={() => loadScenario('happy_path')}
            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-400 ${
              scenarioPreset === 'happy_path'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <span>Happy Path (3:30 PM)</span>
          </button>

          {/* Error / Fallback scenario button */}
          <button
            type="button"
            onClick={() => loadScenario('no_viable_slots')}
            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-400 ${
              scenarioPreset === 'no_viable_slots'
                ? 'bg-amber-950 text-amber-300 border border-amber-500 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span>Edge State (No Viable Slots)</span>
          </button>
        </div>
      </div>
    </header>
  );
};

