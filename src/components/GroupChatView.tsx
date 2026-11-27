import React, { useState, useRef, useEffect } from 'react';
import { useScheduler } from '../context/SchedulerContext';
import { RecommendationCard } from './RecommendationCard';
import { FallbackErrorCard } from './FallbackErrorCard';
import {
  Users,
  Send,
  Sparkles,
  Pin,
  Bot,
  ArrowRight,
  Lock,
  Undo2,
  Bus,
  X
} from 'lucide-react';
import { format24To12 } from '../utils/transitLogic';

const AUTOCOMPLETE_CHIPS = [
  { label: 'Today, 1 hr', command: '@SlotBot meeting today, 1 hour' },
  { label: 'Tomorrow, 30 min', command: '@SlotBot meeting tomorrow, 30 min' },
  { label: 'Custom Time', command: '@SlotBot meeting today, 2:00 PM – 3:00 PM' }
];

export const GroupChatView: React.FC = () => {
  const {
    flowStage,
    groupMessages,
    sendCustomGroupMessage,
    invokeSlotBot,
    repliedCount,
    recommendations,
    confirmedSlot,
    pendingConfirmSlot,
    undoSecondsLeft,
    pinnedBanner,
    busCutoff,
    cutoffOverrideActive,
    shorten30mViableCount,
    suggestTomorrowViableCount,
    requestConfirmSlot,
    cancelConfirmSlot,
    confirmPendingSlot,
    undoConfirmation,
    executeRecovery,
    setViewMode,
    isSynthesizing,
    showGestaltOverlay
  } = useScheduler();

  const [inputMessage, setInputMessage] = useState('');
  const [isComposeFocused, setIsComposeFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const formattedCutoff = format24To12(busCutoff);

  const showAutocomplete = isComposeFocused || inputMessage.includes('@');

  // Auto scroll chat to bottom when messages update
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [groupMessages, flowStage]);

  // Close confirmation modal on Escape
  useEffect(() => {
    if (!pendingConfirmSlot) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancelConfirmSlot();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [pendingConfirmSlot, cancelConfirmSlot]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    sendCustomGroupMessage(inputMessage);
    setInputMessage('');
    setIsComposeFocused(false);
  };

  const handleSelectChip = (command: string) => {
    setInputMessage(command);
    inputRef.current?.focus();
  };

  const getScreenIndex = () => {
    if (flowStage === 'fallback_error') return '04/04';
    if (flowStage === 'recommended' || flowStage === 'confirmed') return '03/04';
    return '01/04';
  };

  const formatModalSlotTime = (timeRange: string) => {
    return timeRange.replace(/^(Today|Tomorrow)\s+/i, '');
  };

  return (
    <div className="flex flex-col h-full bg-[#EFEAE2] text-slate-900 overflow-hidden relative">
      {/* WhatsApp Chat Header */}
      <header className="bg-[#075E54] text-white px-4 py-3 shadow-md flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-emerald-400/30 flex items-center justify-center font-bold text-white text-sm shadow-xs">
              <Users className="w-5 h-5 text-emerald-200" aria-hidden="true" />
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#075E54] rounded-full"
              title="Online"
              aria-label="Online"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-sm tracking-wide text-white">Chat Group</h2>
              <span className="text-[10px] px-1.5 py-0.5 bg-emerald-800/80 rounded font-semibold text-emerald-200 uppercase tracking-wider">
                Group
              </span>
            </div>
            <p className="text-xs text-emerald-100/90 font-medium truncate max-w-[240px]">
              Project team · 4 members + SlotBot
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-200 font-mono text-[11px]">
            {getScreenIndex()}
          </span>
        </div>
      </header>

      {/* Pinned Meeting Banner */}
      {pinnedBanner && (
        <aside
          role="region"
          aria-label="Pinned meeting notice"
          className="bg-emerald-900 text-white px-4 py-2.5 shadow-sm border-b border-emerald-800 flex items-center justify-between gap-3 text-xs shrink-0 animate-fade-in"
        >
          <div className="flex items-center gap-2 truncate">
            <Pin className="w-4 h-4 text-emerald-300 shrink-0" aria-hidden="true" />
            <span className="font-semibold tracking-wide truncate">{pinnedBanner}</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 bg-emerald-800 rounded font-bold uppercase tracking-wider text-emerald-200 shrink-0">
            Confirmed
          </span>
        </aside>
      )}

      {/* Gestalt Principle 2 Banner (Common Region) */}
      {showGestaltOverlay && (
        <aside
          aria-label="Gestalt Common Region Explanation"
          className="mx-3 mt-3 p-3 bg-purple-900/90 text-white rounded-lg text-xs border border-purple-400 space-y-1 shadow-md shrink-0"
        >
          <span className="font-bold uppercase tracking-wider text-purple-200">
            📐 GESTALT PRINCIPLE: Common Region (Group Cards)
          </span>
          <p className="text-purple-100">
            Bounded card containers for group meeting times and bus departure buffer make separate blocks for user perception. Eliminates need for dense grids and allows users to evaluate options as distinct self-contained solutions.
          </p>
        </aside>
      )}

      {/* Chat Messages Stream with Live Region */}
      <main
        tabIndex={0}
        aria-live="polite"
        aria-atomic="false"
        className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4 max-w-2xl mx-auto w-full"
      >
        {/* Date Divider */}
        <div className="flex justify-center my-1">
          <span className="px-3 py-1 bg-white/80 backdrop-blur-xs text-slate-600 text-xs font-semibold rounded-full shadow-2xs border border-slate-200/60">
            Today
          </span>
        </div>

        {/* Dynamic Message List */}
        {groupMessages.map((msg) => {
          const isYou = msg.senderId === 'bilal';
          const isBot = msg.isBot;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isYou ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`relative max-w-[85%] sm:max-w-[78%] rounded-2xl p-3 shadow-xs border text-xs leading-relaxed ${
                  isYou
                    ? 'bg-[#E7FFDB] border-emerald-200 rounded-tr-xs text-slate-900'
                    : isBot
                    ? 'bg-white border-slate-200/90 rounded-tl-xs text-slate-900'
                    : 'bg-white border-slate-200 rounded-tl-xs text-slate-900'
                }`}
              >
                {/* Sender Tag */}
                <div className="flex items-center justify-between gap-3 font-semibold pb-1 mb-1 border-b border-slate-100 text-[11px]">
                  <span
                    className={
                      isBot
                        ? 'text-emerald-700 font-bold flex items-center gap-1'
                        : isYou
                        ? 'text-emerald-800'
                        : 'text-indigo-700'
                    }
                  >
                    {isBot && <Bot className="w-3.5 h-3.5" aria-hidden="true" />}
                    {msg.senderName}
                    {isBot && ' · Auto-reply'}
                  </span>
                  <span className="text-slate-600 font-normal">{msg.timestamp}</span>
                </div>

                {/* Message Body */}
                <p className="whitespace-pre-line text-xs font-normal text-slate-800">
                  {msg.text}
                </p>
              </div>
            </div>
          );
        })}

        {/* SCREEN 1: Availability Requested Status Box with Commuter Transit Status Badge */}
        {flowStage === 'collecting' && (
          <div className="rounded-xl border border-slate-300 bg-white/95 p-3.5 shadow-2xs space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-800">
                Availability requested: {repliedCount} of 4 replies
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                  <Bus className="w-3 h-3 text-slate-600" aria-hidden="true" />
                  <span>Bilal: {formattedCutoff} cutoff active</span>
                </span>
                <span className="text-xs font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Waiting on Bilal
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(repliedCount / 4) * 100}%` }}
              />
            </div>

            <div className="pt-1 flex items-center justify-between gap-2">
              <p className="text-[11px] text-slate-600">
                Alex, Priya, Carlos submitted. SlotBot is awaiting Bilal&apos;s response in DM.
              </p>
              <button
                type="button"
                onClick={() => setViewMode('bilal_dm')}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 active:bg-emerald-900 transition-colors flex items-center gap-1.5 shadow-2xs focus-visible:ring-2 focus-visible:ring-emerald-700"
              >
                <span>Respond in DM</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* Loading Synthesis State (8-State requirement) */}
        {isSynthesizing && (
          <div
            role="status"
            aria-live="assertive"
            className="rounded-xl border border-emerald-300 bg-emerald-50/90 p-4 shadow-2xs flex items-center gap-3 text-xs text-emerald-900 font-medium animate-pulse"
          >
            <div className="w-5 h-5 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin shrink-0" />
            <div>
              <p className="font-bold">Synthesizing team constraints...</p>
              <p className="text-[11px] text-emerald-700">
                Evaluating bus cutoff ({formattedCutoff}), buffer (30m), and mutual overlaps.
              </p>
            </div>
          </div>
        )}

        {/* SCREEN 3: Group Recommendation Cards (Happy Path + Confirmed View) */}
        {(flowStage === 'recommended' || flowStage === 'confirmed') && recommendations.length > 0 && (
          <section
            aria-labelledby="recommendations-heading"
            className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-300 space-y-4"
          >
            <div className="border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                <h3 id="recommendations-heading" className="text-base font-bold text-slate-900">
                  Group Recommendation
                </h3>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Everyone has replied. Ranked for all 4 members, with{' '}
                {cutoffOverrideActive ? (
                  <strong className="text-amber-800">one-time transit override active</strong>
                ) : (
                  <>
                    a <strong className="text-slate-800">30-min transit buffer</strong>
                  </>
                )}
                .
              </p>
            </div>

            {/* 3 Plain-Text Ranked Cards */}
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  onConfirm={requestConfirmSlot}
                  isConfirmed={confirmedSlot?.id === rec.id}
                  disabled={confirmedSlot !== null && confirmedSlot.id !== rec.id}
                />
              ))}
            </div>

            {/* Ineligible blocks exclusion note */}
            {!cutoffOverrideActive && (
              <footer className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 font-medium">
                Today&apos;s later blocks are excluded: {formattedCutoff} transit cutoff.
              </footer>
            )}
          </section>
        )}

        {/* SCREEN 4: Error & Fallback State */}
        {flowStage === 'fallback_error' && (
          <FallbackErrorCard
            busCutoff={busCutoff}
            shorten30mCount={shorten30mViableCount}
            suggestTomorrowCount={suggestTomorrowViableCount}
            onSuggestTomorrow={() => executeRecovery('suggest_tomorrow')}
            onShortenDuration={() => executeRecovery('shorten_30m')}
          />
        )}

        <div ref={chatBottomRef} />
      </main>

      {/* 10-Second Undo Toast Notification */}
      {undoSecondsLeft > 0 && flowStage === 'confirmed' && (
        <div
          role="status"
          aria-live="polite"
          className="mx-3 mb-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white shadow-lg border border-slate-700 flex items-center justify-between gap-3 text-xs z-20 animate-fade-in"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-700 text-white font-mono font-bold text-[11px] shrink-0">
              {undoSecondsLeft}s
            </span>
            <span className="font-medium truncate">
              Meeting locked for all 4 members.
            </span>
          </div>
          <button
            type="button"
            onClick={undoConfirmation}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors focus-visible:ring-2 focus-visible:ring-white"
          >
            <Undo2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Undo ({undoSecondsLeft}s)</span>
          </button>
        </div>
      )}

      {/* Chat Footer / Input Form with Inline @SlotBot Autocomplete Chips */}
      <footer className="bg-slate-100 border-t border-slate-200 p-2.5 sm:p-3 shrink-0">
        {/* Inline @SlotBot Autocomplete Chips (shown when compose focused or '@' typed) */}
        {showAutocomplete && (
          <div
            role="region"
            aria-label="SlotBot command suggestions"
            className="max-w-2xl mx-auto mb-2 flex items-center gap-1.5 overflow-x-auto text-[11px] pb-0.5"
          >
            <span className="font-bold text-emerald-800 shrink-0 flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" aria-hidden="true" />
              <span>@SlotBot:</span>
            </span>
            {AUTOCOMPLETE_CHIPS.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelectChip(chip.command)}
                className="px-2.5 py-1 bg-emerald-50 border border-emerald-300 rounded-full hover:bg-emerald-100 active:bg-emerald-200 font-semibold text-emerald-900 text-[11px] whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-emerald-700"
              >
                {chip.label}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onFocus={() => setIsComposeFocused(true)}
            onBlur={() => setIsComposeFocused(false)}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Message the group (type @SlotBot for suggestions)"
            aria-label="Message the group"
            className="flex-1 bg-white border border-slate-300 rounded-full px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-600 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 shadow-2xs"
          />

          <button
            type="submit"
            aria-label="Send message"
            className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center hover:bg-emerald-800 active:bg-emerald-900 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-700 shadow-xs shrink-0"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
          </button>
        </form>

        {/* Quick Trigger Bar */}
        <div className="max-w-2xl mx-auto mt-2 flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-600 scrollbar-none">
          <span className="font-semibold text-slate-500 shrink-0">Quick Send:</span>
          <button
            type="button"
            onClick={() => invokeSlotBot()}
            className="px-2.5 py-1 bg-white border border-slate-300 rounded-full hover:bg-slate-50 font-medium text-slate-700 text-[11px] whitespace-nowrap focus-visible:ring-1 focus-visible:ring-emerald-600"
          >
            @SlotBot meeting today, 1 hour
          </button>
          <button
            type="button"
            onClick={() => sendCustomGroupMessage('Thanks SlotBot, that works great!')}
            className="px-2.5 py-1 bg-white border border-slate-300 rounded-full hover:bg-slate-50 font-medium text-slate-700 text-[11px] whitespace-nowrap focus-visible:ring-1 focus-visible:ring-emerald-600"
          >
            Thanks SlotBot!
          </button>
        </div>
      </footer>

      {/* 2-Step Confirmation Modal */}
      {pendingConfirmSlot && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-fade-in"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-300 space-y-4 text-slate-900">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 id="confirm-modal-title" className="text-sm font-bold text-slate-900 leading-snug">
                  Lock {formatModalSlotTime(pendingConfirmSlot.timeRange)} meeting for all 4 members?
                </h3>
              </div>
              <button
                type="button"
                onClick={cancelConfirmSlot}
                aria-label="Close confirmation dialog"
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 focus-visible:ring-2 focus-visible:ring-emerald-700"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This will pin the confirmed meeting banner in the group chat and reserve Seminar Room 4B. You&apos;ll have 10 seconds to undo if needed.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={cancelConfirmSlot}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors focus-visible:ring-2 focus-visible:ring-emerald-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmPendingSlot}
                className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-700"
              >
                Yes, Lock Meeting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
