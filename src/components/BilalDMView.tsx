import React from 'react';
import { useScheduler } from '../context/SchedulerContext';
import {
  ShieldCheck,
  Clock,
  Send,
  Loader2,
  AlertCircle,
  Bus,
  CheckCircle2,
  Lock,
  Info
} from 'lucide-react';
import { format24To12 } from '../utils/transitLogic';

export const BilalDMView: React.FC = () => {
  const {
    busCutoff,
    transitBufferMinutes,
    meetingDuration,
    meetingDay,
    activeSlots,
    bilalSelections,
    setSlotSelection,
    submitBilalAvailability,
    isSynthesizing,
    flowStage,
    showGestaltOverlay
  } = useScheduler();

  const formattedCutoff = format24To12(busCutoff);

  return (
    <div className="flex flex-col h-full bg-[#EFEAE2] text-slate-900 overflow-y-auto">
      {/* WhatsApp Chat Header */}
      <header className="sticky top-0 z-20 bg-[#075E54] text-white px-4 py-3 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-emerald-700 border-2 border-emerald-400/40 flex items-center justify-center font-bold text-white text-sm shadow-xs">
              🤖
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#075E54] rounded-full"
              title="Verified Bot Online"
              aria-label="Verified Bot Online"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-sm tracking-wide text-white">SlotBot</h2>
              <span className="text-[10px] px-1.5 py-0.5 bg-emerald-800/80 rounded font-semibold text-emerald-200 uppercase tracking-wider">
                DM
              </span>
            </div>
            <p className="text-xs text-emerald-100/90 font-medium truncate max-w-[220px]">
              You + SlotBot · Project team meeting
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-200 font-mono text-[11px]">
            02/04
          </span>
        </div>
      </header>

      {/* Main Container / Message Stream */}
      <main className="flex-1 p-3 sm:p-5 max-w-2xl mx-auto w-full space-y-4">
        {/* Date separator */}
        <div className="flex justify-center my-1">
          <span className="px-3 py-1 bg-white/80 backdrop-blur-xs text-slate-600 text-xs font-semibold rounded-full shadow-2xs border border-slate-200/60">
            {meetingDay === 'today' ? 'Today' : 'Tomorrow'}
          </span>
        </div>

        {/* SlotBot Intro Chat Bubble */}
        <div className="flex items-start gap-2 max-w-md">
          <div className="bg-white rounded-2xl rounded-tl-xs p-3.5 shadow-xs border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between gap-3 text-xs text-slate-500 font-medium pb-1 border-b border-slate-100">
              <span className="font-bold text-emerald-800">SlotBot Auto-assistant</span>
              <span>12:41 PM</span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed">
              Alex called for a <span className="font-bold">{meetingDuration}-minute meeting</span>. Please declare your availability below.
            </p>
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2">
              <Bus className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-bold">Commuter Transit Shield Active</p>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Your <span className="font-semibold">{formattedCutoff} university bus departure</span> requires a mandatory <span className="font-semibold">{transitBufferMinutes}-minute buffer</span>. Ineligible slots are auto-locked.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gestalt Principle 2 Banner (Common Region) */}
        {showGestaltOverlay && (
          <aside
            aria-label="Gestalt Common Region Explanation"
            className="p-3 bg-purple-900/90 text-white rounded-lg text-xs border border-purple-400 space-y-1 shadow-md animate-fade-in"
          >
            <span className="font-bold uppercase tracking-wider text-purple-200">
              📐 GESTALT PRINCIPLE: Common Region & Proximity
            </span>
            <p className="text-purple-100">
              Bounded container below groups availability blocks, bus departure buffer, and actions into a distinct cognitive unit, eliminating ambiguous grids.
            </p>
          </aside>
        )}

        {/* SCREEN 2 Interactive Wireframe Card: Private DM Input */}
        <section
          aria-labelledby="dm-form-heading"
          className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-300 relative transition-all"
        >
          {/* Card Header */}
          <div className="border-b border-slate-200 pb-3 mb-4">
            <h3 id="dm-form-heading" className="text-base font-bold text-slate-900">
              {meetingDay === 'today' ? 'Today' : 'Tomorrow'} · {meetingDuration}-hour meeting
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Mark each available block <strong className="text-slate-800">Free</strong> or{' '}
              <strong className="text-slate-800">Busy</strong>. Times are PM, in your local time.
            </p>
          </div>

          {/* Availability Blocks List */}
          <div className="space-y-3.5">
            {activeSlots.map((slot) => {
              const isBlocked = slot.isPreBlocked;
              const currentStatus = bilalSelections[slot.id] || (isBlocked ? 'unset' : 'unset');
              const isFree = currentStatus === 'free';
              const isBusy = currentStatus === 'busy';

              return (
                <fieldset
                  key={slot.id}
                  disabled={isBlocked}
                  aria-disabled={isBlocked}
                  className={`rounded-xl p-3 border transition-all ${
                    isBlocked
                      ? 'bg-slate-100/80 border-slate-200 text-slate-400 opacity-80'
                      : 'bg-white border-slate-300 hover:border-slate-400 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2.5">
                    <legend className="font-mono font-bold text-sm text-slate-900">
                      <span className={isBlocked ? 'text-slate-500 line-through decoration-slate-400' : 'text-slate-900'}>
                        {slot.displayTime}
                      </span>
                    </legend>

                    {/* Status Badge */}
                    <div>
                      {isBlocked ? (
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300"
                          aria-label={`Pre-blocked: ${formattedCutoff} transit cutoff`}
                        >
                          <Lock className="w-3 h-3 text-amber-700" aria-hidden="true" />
                          <span>Pre-blocked: {formattedCutoff} transit cutoff</span>
                        </span>
                      ) : isFree ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" aria-hidden="true" />
                          <span>Selected: Free</span>
                        </span>
                      ) : isBusy ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          Selected: Busy
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-slate-500">
                          Select option
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Gestalt: Proximity & Contrast: Binary and Free toggles directly inside their parent row */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Free Toggle */}
                    <button
                      type="button"
                      disabled={isBlocked}
                      onClick={() => setSlotSelection(slot.id, 'free')}
                      aria-pressed={isFree}
                      aria-label={`${slot.displayTime} Free`}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:outline-none ${
                        isBlocked
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
                          : isFree
                          ? 'bg-emerald-700 text-white shadow-xs border border-emerald-800'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300 border border-slate-300'
                      }`}
                    >
                      {isFree && <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />}
                      <span>Free</span>
                    </button>

                    {/* Busy Toggle */}
                    <button
                      type="button"
                      disabled={isBlocked}
                      onClick={() => setSlotSelection(slot.id, 'busy')}
                      aria-pressed={isBusy}
                      aria-label={`${slot.displayTime} Busy`}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:outline-none ${
                        isBlocked
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
                          : isBusy
                          ? 'bg-slate-800 text-white shadow-xs border border-slate-900'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300 border border-slate-300'
                      }`}
                    >
                      <span>Busy</span>
                    </button>
                  </div>

                  {/* Caption / Blocked Reason */}
                  {isBlocked && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" aria-hidden="true" />
                      <span>{slot.blockedReason || `Pre-blocked: ${formattedCutoff} transit cutoff`}</span>
                    </div>
                  )}

                  {!isBlocked && slot.bufferBeforeBusMinutes !== undefined && (
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium">
                      <Clock className="w-3 h-3 text-emerald-600 shrink-0" aria-hidden="true" />
                      <span>Leaves safe {slot.bufferBeforeBusMinutes} min buffer before your {formattedCutoff} bus</span>
                    </div>
                  )}
                </fieldset>
              );
            })}
          </div>

          {/* Explanatory Footer Note */}
          <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs flex items-start gap-2">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              A <strong className="text-slate-900">30-min buffer</strong> is strictly required before university transit departure. Blocked times cannot be selected.
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="mt-5 space-y-2">
            <button
              type="button"
              disabled={isSynthesizing}
              onClick={submitBilalAvailability}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-sm transition-all duration-150 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:outline-none ${
                isSynthesizing
                  ? 'bg-emerald-800 text-white cursor-wait opacity-90'
                  : 'bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900 active:scale-[0.99]'
              }`}
            >
              {isSynthesizing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" aria-hidden="true" />
                  <span>Synthesizing team constraints...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" aria-hidden="true" />
                  <span>Send availability</span>
                </>
              )}
            </button>

            <p className="text-center text-[11px] text-slate-500 font-medium">
              Your selections are shared with SlotBot only.
            </p>
          </div>
        </section>

        {/* Quick status notice */}
        {flowStage === 'recommended' && (
          <div className="p-3 bg-white rounded-xl border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Availability submitted! Recommendations posted to group.</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
