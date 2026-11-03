import React from 'react';
import { useScheduler } from '../context/SchedulerContext';
import {
  X,
  Bus,
  Clock,
  Shield,
  HelpCircle,
  Sliders,
  Check
} from 'lucide-react';
import { format24To12 } from '../utils/transitLogic';

interface TransitSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransitSettingsModal: React.FC<TransitSettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    busCutoff,
    setBusCutoff,
    transitBufferMinutes,
    setTransitBufferMinutes,
    meetingDuration,
    setMeetingDuration,
    flowStage,
    setFlowStage
  } = useScheduler();

  if (!isOpen) return null;

  const formattedCutoff = format24To12(busCutoff);

  const presets = [
    { label: '3:30 PM (Default University Bus)', value: '15:30', note: 'Leaves 2:00–3:00 PM slot viable' },
    { label: '2:15 PM (Early Transit / Edge Case)', value: '14:15', note: 'Triggers fallback error state' },
    { label: '4:15 PM (Late Bus)', value: '16:15', note: 'Multiple slots viable' },
    { label: '5:00 PM (Evening Bus)', value: '17:00', note: 'All afternoon slots viable' }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="transit-settings-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-300 space-y-5 text-slate-900 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Bus className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="transit-settings-title" className="text-base font-bold text-slate-900">
                Commuter Transit Settings
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Deliverable D4: Non-negotiable transit cutoff parameters
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings dialog"
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-emerald-700"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Core Formula Callout */}
        <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs space-y-1.5 font-mono">
          <span className="text-emerald-400 font-bold tracking-wider text-[11px] block uppercase">
            📐 Core Mathematical Constraint
          </span>
          <p className="text-slate-200">
            (Slot End Time + {transitBufferMinutes}m Buffer) &gt; {formattedCutoff} Bus Cutoff
          </p>
          <p className="text-slate-400 text-[11px] font-sans">
            Any slot violating this condition is automatically pre-blocked and locked to guarantee commuter safety.
          </p>
        </div>

        {/* Bus Cutoff Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span>Bilal's Bus Departure Time (Cutoff)</span>
            <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Current: {formattedCutoff}
            </span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {presets.map((preset) => {
              const isSelected = busCutoff === preset.value;
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => {
                    setBusCutoff(preset.value);
                  }}
                  className={`p-3 rounded-xl text-left border transition-all text-xs focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/80 ring-1 ring-emerald-500'
                      : 'border-slate-300 hover:border-slate-400 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{preset.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-700" />}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{preset.note}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Buffer Minutes Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span>Mandatory Transit Safety Buffer</span>
            <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {transitBufferMinutes} Minutes
            </span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[15, 30, 45].map((mins) => {
              const isSelected = transitBufferMinutes === mins;
              return (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setTransitBufferMinutes(mins)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{mins} min {mins === 30 && '(Standard)'}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Meeting Duration */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span>Requested Meeting Duration</span>
            <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {meetingDuration} Minutes
            </span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[60, 30].map((duration) => {
              const isSelected = meetingDuration === duration;
              return (
                <button
                  key={duration}
                  type="button"
                  onClick={() => setMeetingDuration(duration)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                    isSelected
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span>{duration} Minutes {duration === 60 ? '(Default)' : '(Shortened)'}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer / Apply */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 active:bg-slate-950 transition-colors shadow-xs"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};

