import React from 'react';
import { AlertTriangle, Calendar, Clock, RefreshCw } from 'lucide-react';
import { format24To12 } from '../utils/transitLogic';

interface FallbackErrorCardProps {
  busCutoff: string;
  onSuggestTomorrow: () => void;
  onShortenDuration: () => void;
}

export const FallbackErrorCard: React.FC<FallbackErrorCardProps> = ({
  busCutoff,
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
      <div className="flex items-center gap-2 mb-2">
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
        No slots found with a safe 30-min buffer. Options:
      </h3>

      <p
        id="scheduling-issue-desc"
        className="mt-2 text-xs text-slate-700 leading-relaxed font-medium"
      >
        No 1-hour block works for everyone before the{' '}
        <span className="font-bold text-slate-900 underline decoration-amber-500 decoration-2">
          {formattedCutoff}
        </span>{' '}
        transit cutoff without violating commuter departure safety.
      </p>

      {/* Action Recovery Buttons */}
      <div className="mt-4 space-y-2.5">
        <button
          type="button"
          onClick={onSuggestTomorrow}
          className="w-full py-2.5 px-4 rounded-lg bg-slate-900 text-white font-semibold text-xs tracking-wide hover:bg-slate-800 active:bg-slate-950 transition-colors flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:outline-none shadow-xs"
        >
          <Calendar className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <span>Suggest Tomorrow</span>
        </button>

        <button
          type="button"
          onClick={onShortenDuration}
          className="w-full py-2.5 px-4 rounded-lg bg-white border border-slate-300 text-slate-800 font-semibold text-xs tracking-wide hover:bg-slate-100 hover:border-slate-400 active:bg-slate-200 transition-colors flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:outline-none shadow-xs"
        >
          <Clock className="w-4 h-4 text-amber-600" aria-hidden="true" />
          <span>Shorten to 30 min</span>
        </button>
      </div>

      <footer className="mt-3 pt-3 border-t border-amber-200/80 text-[11px] text-slate-600 leading-tight">
        The 30-min buffer stays in place for either option. Nothing has been scheduled.
      </footer>
    </article>
  );
};

