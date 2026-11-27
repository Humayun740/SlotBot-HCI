import React from 'react';
import { RecommendedSlot } from '../types';
import { CheckCircle2, Clock, Users, ShieldAlert, Award } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: RecommendedSlot;
  onConfirm: (slot: RecommendedSlot) => void;
  isConfirmed: boolean;
  disabled?: boolean;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onConfirm,
  isConfirmed,
  disabled
}) => {
  const isBest = recommendation.badgeLabel === 'BEST';

  return (
    <article
      aria-label={`Rank ${recommendation.rank}: ${recommendation.timeRange}`}
      className={`relative rounded-xl border p-4 transition-all duration-200 ${
        isBest
          ? 'bg-emerald-50/80 border-emerald-400 shadow-sm ring-1 ring-emerald-300/60'
          : 'bg-white border-slate-300 hover:border-slate-400 shadow-xs'
      }`}
    >
      {/* Header with Rank & Text Badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {isBest ? (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase bg-emerald-700 text-white shadow-xs"
              aria-label="Top recommendation: BEST"
            >
              <Award className="w-3.5 h-3.5" aria-hidden="true" />
              <span>BEST</span>
            </span>
          ) : (
            <span
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold tracking-wide uppercase bg-slate-200 text-slate-800"
              aria-label={`Rank ${recommendation.rank}: Alternative`}
            >
              {recommendation.rank} · ALTERNATIVE
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs font-medium text-slate-700">
          <Users className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          <span>{recommendation.freeCount}/{recommendation.totalMembers} free</span>
        </div>
      </div>

      {/* Main Time Range */}
      <h3 className="text-base font-bold text-slate-900 leading-snug">
        {isBest ? (
          <span>
            {recommendation.timeRange}{' '}
            <span className="text-slate-600 font-semibold text-sm">
              ({recommendation.freeCount}/{recommendation.totalMembers} free, {recommendation.bufferNote})
            </span>
          </span>
        ) : (
          <span>{recommendation.timeRange}</span>
        )}
      </h3>

      {/* Buffer safety details */}
      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
        <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
        <span>{recommendation.bufferNote}</span>
        {!isBest && (
          <span className="text-slate-600 font-normal">· {recommendation.freeCount}/{recommendation.totalMembers} free</span>
        )}
      </div>

      {recommendation.tagline && (
        <p className="mt-1 text-xs text-slate-600">
          {recommendation.tagline}
        </p>
      )}

      {/* Action button */}
      <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between gap-3">
        {isConfirmed ? (
          <div
            role="status"
            className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-800 text-white font-semibold text-xs tracking-wide shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" aria-hidden="true" />
            <span>CONFIRMED & LOCKED</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onConfirm(recommendation)}
            disabled={disabled}
            aria-label={`Confirm meeting for ${recommendation.timeRange}`}
            className={`w-full py-2 px-4 rounded-lg font-semibold text-xs transition-colors duration-150 flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:outline-none ${
              isBest
                ? 'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 active:scale-[0.99] shadow-xs'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300'
            }`}
          >
            <span>{isBest ? 'Confirm' : 'Select Alternative'}</span>
          </button>
        )}
      </div>
    </article>
  );
};
