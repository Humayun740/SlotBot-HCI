import React, { useState, useEffect } from 'react';
import { SchedulerProvider, useScheduler } from './context/SchedulerContext';
import { TopNavigation } from './components/TopNavigation';
import { GroupChatView } from './components/GroupChatView';
import { BilalDMView } from './components/BilalDMView';
import { TransitSettingsModal } from './components/TransitSettingsModal';
import { EvaluatorGuideModal } from './components/EvaluatorGuideModal';
import {
  Smartphone,
  Info,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Award
} from 'lucide-react';

const PrototypeContent: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    showEvaluatorGuide,
    setShowEvaluatorGuide,
    scenarioPreset,
    loadScenario,
    resetAll,
    flowStage
  } = useScheduler();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Global keyboard shortcuts for evaluators
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === '1') {
        setViewMode('group');
      } else if (e.key === '2') {
        setViewMode('bilal_dm');
      } else if (e.key === '3') {
        setViewMode('split');
      } else if (e.key === '?' || e.key === 'h' || e.key === 'H') {
        setShowEvaluatorGuide(true);
      } else if (e.key === 's' || e.key === 'S') {
        setIsSettingsOpen(prev => !prev);
      } else if (e.key === 'r' || e.key === 'R') {
        resetAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setViewMode, setShowEvaluatorGuide, resetAll]);

  return (
    <div className="flex flex-col h-screen bg-slate-200 text-slate-900 font-sans select-none overflow-hidden">
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-700 focus:text-white focus:rounded-md focus:font-bold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* Top Application Bar */}
      <TopNavigation onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main Workspace Frame */}
      <div id="main-content" className="flex-1 flex flex-col p-2 sm:p-4 overflow-hidden items-center justify-center">
        {/* VIEW MODE 1: Group Chat Single Frame */}
        {viewMode === 'group' && (
          <div className="w-full max-w-lg h-full max-h-[820px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-300 flex flex-col animate-fade-in">
            <GroupChatView />
          </div>
        )}

        {/* VIEW MODE 2: Bilal DM Single Frame */}
        {viewMode === 'bilal_dm' && (
          <div className="w-full max-w-lg h-full max-h-[820px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-300 flex flex-col animate-fade-in">
            <BilalDMView />
          </div>
        )}

        {/* VIEW MODE 3: Split View (Side-by-side synchronized evaluation) */}
        {viewMode === 'split' && (
          <div className="w-full max-w-6xl h-full max-h-[820px] grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden animate-fade-in">
            {/* Left: Group Chat */}
            <div className="h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-300 flex flex-col">
              <div className="bg-slate-800 text-white px-3 py-1.5 text-[11px] font-bold flex items-center justify-between border-b border-slate-700">
                <span>VIEW 1: Group Chat (@SlotBot)</span>
                <span className="text-slate-400 font-normal">Synchronized</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <GroupChatView />
              </div>
            </div>

            {/* Right: Bilal's Private DM */}
            <div className="h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-300 flex flex-col">
              <div className="bg-slate-800 text-white px-3 py-1.5 text-[11px] font-bold flex items-center justify-between border-b border-slate-700">
                <span>VIEW 2: Bilal's Private DM (Availability Input)</span>
                <span className="text-emerald-400 font-normal">Commuter Cutoff Shield Active</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <BilalDMView />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status / Keyboard Hint Bar */}
      <footer className="bg-slate-900 border-t border-slate-800 px-4 py-2 text-white text-xs flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-slate-300">SlotBot Engine:</span>
            <span className="text-emerald-300 font-mono text-[11px]">
              {flowStage === 'collecting' && 'Waiting for Bilal availability'}
              {flowStage === 'synthesizing' && 'Synthesizing team constraints...'}
              {flowStage === 'recommended' && '3 Ranked cards generated'}
              {flowStage === 'fallback_error' && 'Actionable fallback error displayed'}
              {flowStage === 'confirmed' && 'Meeting confirmed & pinned'}
            </span>
          </div>
        </div>

        {/* Keyboard navigation hints */}
        <div className="hidden sm:flex items-center gap-2 text-slate-400 text-[11px]">
          <span>Shortcuts:</span>
          <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] text-slate-300">1</kbd> Group
          <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] text-slate-300">2</kbd> Bilal DM
          <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] text-slate-300">3</kbd> Split
          <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] text-slate-300">?</kbd> Guide
        </div>
      </footer>

      {/* Settings Modal */}
      <TransitSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Evaluator Guide Modal */}
      <EvaluatorGuideModal
        isOpen={showEvaluatorGuide}
        onClose={() => setShowEvaluatorGuide(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <SchedulerProvider>
      <PrototypeContent />
    </SchedulerProvider>
  );
}

