import React from 'react';
import { AlertTriangle, Calendar, Clock } from 'lucide-react';
import { format24To12 } from '../utils/transitLogic';

interface FallbackErrorCardProps {
  busCutoff: string;
  shorten30mCount: number;
  suggestTomorrowCount: number;
  onSuggestTomorrow: () => void;
  onShortenDuration: () => void;
}

export const FallbackErrorCard: React.FC<FallbackErrorCardProps> = ({
  busCutoff,
  shorten30mCount,
  suggestTomorrowCount,
  onSuggestTomorrow,
  onShortenDuration
}) => {
  const formattedCutoff = format24To12(busCutoff);

  return (
    <article
      role="alert"
      aria-labelledby="scheduling-issue-title"
      aria-describedby="scheduling-issue-desc"
      className="rounded-xl border-2 border-amber-300 bg-amber-50/90 p-5 shadow-sm text-slate-900"
    >
      {/* Badge / Category Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-amber-800 text-white"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-200" aria-hidden="true" />
          <span>SCHEDULING ISSUE</span>
        </span>
      </div>

      <h3
        id="scheduling-issue-title"
        className="text-base font-bold text-slate-900 leading-snug mt-1"
      >
        No slots found with a safe 30-min buffer.
      </h3>

      {/* Explicit Conflict Cause Callout */}
      <div className="mt-2 px-3 py-2 rounded-lg bg-amber-100/90 border border-amber-300 text-xs font-semibold text-amber-950">
        Conflict: Bilal&apos;s {formattedCutoff} transit cutoff + 30-min buffer leaves no mutual 1-hour window today.
      </div>

      <p
        id="scheduling-issue-desc"
        className="mt-2 text-xs text-slate-700 leading-relaxed font-medium"
      >
        Choose a recovery option below — each shows how many commuter-safe slots are available:
      </p>

      {/* Action Recovery Buttons with Predictive Slot Previews */}
      <div className="mt-3.5 space-y-2.5">
        <button
          type="button"
          onClick={onSuggestTomorrow}
          className="w-full py-2.5 px-4 rounded-lg bg-slate-900 text-white font-semibold text-xs tracking-wide hover:bg-slate-800 active:bg-slate-950 transition-colors flex items-center justify-between gap-2 focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:outline-none shadow-xs"
        >
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
            <span>Suggest Tomorrow</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-800/90 text-emerald-200 text-[11px] font-bold">
            {suggestTomorrowCount} viable {suggestTomorrowCount === 1 ? 'slot' : 'slots'} found
          </span>
        </button>

        <button
          type="button"
          onClick={onShortenDuration}
          className="w-full py-2.5 px-4 rounded-lg bg-white border border-slate-300 text-slate-800 font-semibold text-xs tracking-wide hover:bg-slate-100 hover:border-slate-400 active:bg-slate-200 transition-colors flex items-center justify-between gap-2 focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:outline-none shadow-xs"
        >
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
            <span>Shorten to 30 min</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold">
            {shorten30mCount} viable {shorten30mCount === 1 ? 'slot' : 'slots'} found
          </span>
        </button>
      </div>

      <footer className="mt-3 pt-3 border-t border-amber-200/80 text-[11px] text-slate-600 leading-tight">
        The 30-min buffer stays in place for either option. Nothing has been scheduled.
      </footer>
    </article>
  );
};
