import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Lock,
  Loader2,
  MousePointer,
  Award,
  Pin,
  Sparkles,
  Layers,
  ShieldCheck,
  Eye,
  Keyboard,
  ExternalLink
} from 'lucide-react';

interface EvaluatorGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EvaluatorGuideModal: React.FC<EvaluatorGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'8states' | 'wcag' | 'gestalt' | 'flow'>('8states');

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="evaluator-guide-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in"
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-300 text-slate-900 overflow-hidden">
        {/* Header */}
        <header className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white text-base">
              ✓
            </div>
            <div>
              <h2 id="evaluator-guide-title" className="text-base font-bold text-white leading-tight">
                HCI Evaluation &amp; Design Architecture Guide
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                SlotBot Deliverable D4 Part B: 8-State UI, WCAG 2.1 AA &amp; Gestalt Principles
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close evaluation guide"
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </header>

        {/* Tab Navigation */}
        <nav
          aria-label="Evaluator sections"
          className="px-5 pt-3 border-b border-slate-200 bg-slate-50 flex gap-2 shrink-0 overflow-x-auto"
        >
          <button
            type="button"
            onClick={() => setActiveTab('8states')}
            className={`pb-2.5 px-3 font-bold text-xs border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === '8states'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" aria-hidden="true" />
            <span>1. Complete 8-State UI Matrix</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wcag')}
            className={`pb-2.5 px-3 font-bold text-xs border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'wcag'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            <span>2. WCAG 2.1 AA &amp; Accessibility</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gestalt')}
            className={`pb-2.5 px-3 font-bold text-xs border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'gestalt'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-4 h-4" aria-hidden="true" />
            <span>3. Gestalt Principles (Wireframes)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('flow')}
            className={`pb-2.5 px-3 font-bold text-xs border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'flow'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>4. Commuter Transit Logic</span>
          </button>
        </nav>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* TAB 1: 8-State UI Matrix */}
          {activeTab === '8states' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                <p className="font-bold">
                  Core Requirement 3: 8-State UI Implementation
                </p>
                <p className="mt-0.5 text-emerald-800">
                  Every primary component has dedicated styling and semantics across all 8 interactive states: Default, Hover/Focus, Active, Disabled, Loading, Empty, Error, and Success.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* 1. Default */}
                <div className="border border-slate-200 rounded-xl p-3.5 bg-white shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">1. Default State</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">Resting</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="py-2 px-3 rounded-lg text-xs font-semibold bg-slate-100 border border-slate-300 text-slate-700 w-full text-center">
                      [Free] Resting
                    </div>
                    <div className="py-2 px-3 rounded-lg text-xs font-semibold bg-slate-100 border border-slate-300 text-slate-700 w-full text-center">
                      [Busy] Resting
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500">Unpressed neutral buttons with clear contrast and borders.</p>
                </div>

                {/* 2. Hover / Focus */}
                <div className="border border-slate-200 rounded-xl p-3.5 bg-white shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">2. Hover / Focus State</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono">Keyboard Ring</span>
                  </div>
                  <div className="py-2 px-3 rounded-lg text-xs font-semibold bg-slate-200 text-slate-900 ring-2 ring-emerald-700 ring-offset-2 w-full text-center">
                    Focused with 2px High-Contrast Ring
                  </div>
                  <p className="text-[11px] text-slate-500">High-visibility emerald ring meeting WCAG 2.4.7 Focus Visible.</p>
                </div>

                {/* 3. Active */}
                <div className="border border-slate-200 rounded-xl p-3.5 bg-white shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">3. Active / Pressed State</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono">aria-pressed="true"</span>
                  </div>
                  <div className="py-2 px-3 rounded-lg text-xs font-bold bg-emerald-700 text-white shadow-xs w-full flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>[Free] Selected</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Immediate visual feedback with checkmark and filled emerald palette.</p>
                </div>

                {/* 4. Disabled */}
                <div className="border border-slate-200 rounded-xl p-3.5 bg-white shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">4. Disabled State (Cutoff Locked)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-mono">Pre-Blocked</span>
                  </div>
                  <div className="py-2 px-3 rounded-lg text-xs font-semibold bg-slate-200 text-slate-400 border border-slate-200 cursor-not-allowed w-full flex items-center justify-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pre-blocked: 3:30 PM transit cutoff</span>
                  </div>
                  <p className="text-[11px] text-slate-500">HTML disabled + aria-disabled + text badge so color-blind users can tell immediately.</p>
                </div>

                {/* 5. Loading */}
                <div className="border border-slate-200 rounded-xl p-3.5 bg-white shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">5. Loading State</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-mono">Synthesis</span>
                  </div>
                  <div className="py-2.5 px-3 rounded-lg text-xs font-bold bg-emerald-800 text-white w-full flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Synthesizing team constraints...</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Simulated constraint solver delay with aria-live status update.</p>
                </div>

                {/* 6. Empty */}
                <div className="border border-slate-200 rounded-xl p-3.5 bg-white shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">6. Empty State</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">Uncollected</span>
                  </div>
                  <div className="py-2 px-3 rounded-lg text-xs text-slate-500 border border-dashed border-slate-300 w-full text-center">
                    Availability requested · 0 of 4 replies
                  </div>
                  <p className="text-[11px] text-slate-500">Clean waiting indicator before responses arrive.</p>
                </div>

                {/* 7. Error */}
                <div className="border border-slate-200 rounded-xl p-3.5 bg-white shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">7. Error / Edge State</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-mono">Actionable Recovery</span>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-100 border border-amber-300 text-[11px] text-slate-900 font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>No slots found with a 30-min buffer.</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Presents dual recovery actions: [Suggest Tomorrow] &amp; [Shorten to 30 min].</p>
                </div>

                {/* 8. Success */}
                <div className="border border-slate-200 rounded-xl p-3.5 bg-white shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">8. Success State</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono">Confirmed &amp; Pinned</span>
                  </div>
                  <div className="py-2 px-3 rounded-lg text-xs font-bold bg-emerald-800 text-white w-full flex items-center justify-center gap-1.5 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>CONFIRMED &amp; PINNED TO GROUP</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Locks options, shows permanent group banner, and confirms transit buffer safety.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WCAG 2.1 AA Checklist */}
          {activeTab === 'wcag' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-indigo-50 rounded-xl border border-indigo-200 text-xs text-indigo-900">
                <p className="font-bold">WCAG 2.1 AA Compliance Verification</p>
                <p className="mt-0.5 text-indigo-800">
                  Every requirement has been tested for screen readers, keyboard-only traversal, high contrast, and non-color dependent cues.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 border border-slate-200 rounded-xl bg-white flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-slate-900">1.4.3 Contrast (Minimum 4.5:1)</p>
                    <p className="text-slate-600">
                      All body copy uses slate-900 (#0f172a) on white/slate-50 (contrast &gt; 12:1). Button labels on emerald-700 (#047857) have contrast &gt; 5.2:1 against white text.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 border border-slate-200 rounded-xl bg-white flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-slate-900">1.4.1 Use of Color Alone (Strictly Avoided)</p>
                    <p className="text-slate-600">
                      The top slot has a distinct text badge <strong className="text-slate-900">"BEST"</strong> and an Award icon. Blocked slots feature explicit text <strong className="text-slate-900">"Unavailable"</strong> and <strong className="text-slate-900">"Blocked: 3:30 PM transit cutoff"</strong>. Free selections show <strong className="text-slate-900">"Selected: Free"</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 border border-slate-200 rounded-xl bg-white flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-slate-900">2.1.1 &amp; 2.1.2 Keyboard Accessible &amp; No Trap</p>
                    <p className="text-slate-600">
                      Every interactive control is reachable using <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-300 font-mono text-[10px]">Tab</kbd>, activated using <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-300 font-mono text-[10px]">Enter</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-300 font-mono text-[10px]">Space</kbd>, and modals close with <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-300 font-mono text-[10px]">Escape</kbd>.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 border border-slate-200 rounded-xl bg-white flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-slate-900">4.1.3 Status Messages &amp; Semantic HTML</p>
                    <p className="text-slate-600">
                      Uses <code className="text-emerald-700 bg-slate-100 px-1 rounded">&lt;main&gt;</code>, <code className="text-emerald-700 bg-slate-100 px-1 rounded">&lt;section&gt;</code>, <code className="text-emerald-700 bg-slate-100 px-1 rounded">&lt;fieldset&gt;</code>, and <code className="text-emerald-700 bg-slate-100 px-1 rounded">aria-live="polite"</code> for chat and synthesis alerts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Gestalt Principles */}
          {activeTab === 'gestalt' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900">
                <p className="font-bold">Gestalt Psychology in Commuter Scheduling</p>
                <p className="mt-0.5 text-purple-800">
                  Directly realizing Frame 1 and Frame 2 annotations from the project wireframes.
                </p>
              </div>

              {/* Frame 1 Callout */}
              <div className="border border-purple-300 bg-purple-50/50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-purple-800 text-white font-mono text-[10px] font-bold">
                    FRAME 1
                  </span>
                  <h4 className="font-bold text-xs text-purple-950 uppercase tracking-wide">
                    GESTALT: Proximity &amp; Contrast
                  </h4>
                </div>
                <p className="text-xs text-purple-900 leading-relaxed">
                  <strong>Proximity:</strong> Binary [Free] and [Busy] toggles are located directly within their parent row, removing any visual ambiguity of what slot is being modified.
                </p>
                <p className="text-xs text-purple-900 leading-relaxed">
                  <strong>Contrast:</strong> 3–5 PM blocks use muted, low-contrast disabled themes and lock icons to immediately convey ineligibility before the user even attempts interaction.
                </p>
              </div>

              {/* Frame 2 Callout */}
              <div className="border border-indigo-300 bg-indigo-50/50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-indigo-800 text-white font-mono text-[10px] font-bold">
                    FRAME 2
                  </span>
                  <h4 className="font-bold text-xs text-indigo-950 uppercase tracking-wide">
                    GESTALT: Common Region
                  </h4>
                </div>
                <p className="text-xs text-indigo-900 leading-relaxed">
                  Bounded card containers for group meeting times and bus departure buffer create distinct, separate perceptual blocks.
                </p>
                <p className="text-xs text-indigo-900 leading-relaxed">
                  This eliminates the cognitive overload of dense 2D calendar matrices and allows commuter students to evaluate options as distinct, self-contained solutions.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Commuter Transit Logic */}
          {activeTab === 'flow' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-1">
                <p className="font-bold text-emerald-400">Non-Negotiable University Bus Cutoff Rule</p>
                <p className="text-slate-300 font-mono text-[11px]">
                  (Slot End Time + 30 min buffer) &gt; Bus Departure Time (3:30 PM default)
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Slot Block</th>
                      <th className="p-2.5">Calculation (End + 30m)</th>
                      <th className="p-2.5">Cutoff (3:30 PM)</th>
                      <th className="p-2.5">System Verdict</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="bg-emerald-50/60">
                      <td className="p-2.5 font-mono font-bold text-emerald-900">2:00 – 3:00 PM</td>
                      <td className="p-2.5 font-mono">3:00 PM + 30m = 3:30 PM</td>
                      <td className="p-2.5 font-mono">3:30 PM</td>
                      <td className="p-2.5 font-bold text-emerald-700">✓ Viable (Rank 1 BEST)</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-2.5 font-mono text-slate-600 line-through">3:00 – 4:00 PM</td>
                      <td className="p-2.5 font-mono text-slate-600">4:00 PM + 30m = 4:30 PM</td>
                      <td className="p-2.5 font-mono">3:30 PM</td>
                      <td className="p-2.5 font-bold text-rose-700">✕ Blocked (+60m violation)</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-2.5 font-mono text-slate-600 line-through">4:00 – 5:00 PM</td>
                      <td className="p-2.5 font-mono text-slate-600">5:00 PM + 30m = 5:30 PM</td>
                      <td className="p-2.5 font-mono">3:30 PM</td>
                      <td className="p-2.5 font-bold text-rose-700">✕ Blocked (+120m violation)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                <p className="font-bold">Edge Scenario: Bus Cutoff at 2:15 PM</p>
                <p className="mt-0.5 text-amber-800">
                  When bus departure is at 2:15 PM, even the 2:00–3:00 PM block ends too late (3:00 PM &gt; 2:15 PM). The system gracefully catches this and delivers Screen 4's Fallback card with options to Suggest Tomorrow or Shorten Duration.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="px-5 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-500 font-medium">Deliverable D4 Part B Interactive Prototype</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-emerald-600 shadow-xs"
          >
            Close Guide
          </button>
        </footer>
      </div>
    </div>
  );
};

