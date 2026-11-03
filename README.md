# SlotBot — WhatsApp Commuter Team Scheduler
### HCI Deliverable D4 Part B: Interactive Vertical Slice Prototype

SlotBot is an accessible, WhatsApp-inspired team scheduling prototype specifically engineered for transit-constrained commuter university students. It eliminates mutual scheduling overhead while rigorously enforcing non-negotiable commuter transit cutoffs.

---

## 🚀 Quick Start (Zero External API Dependencies)

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

3. **Or run the production build / preview**:
   ```bash
   npm run build
   npm run preview
   ```
   Open [http://localhost:4173](http://localhost:4173) in your browser.

---

## 📱 Deliverable D4 Part B Wireframe Mapping

| Screen | Wireframe Label | Description |
|---|---|---|
| **Screen 1** | `Chat group [SCREEN 1]` | Group chat view where `@SlotBot meeting today, 1 hour` is invoked; displays auto-reply and real-time reply progress (`3 of 4 replies`). |
| **Screen 2** | `Private DM input [SCREEN 2]` | Bilal's private conversation view with SlotBot to declare availability with binary toggles (`[Free]` / `[Busy]`) and automatic pre-blocking of ineligible commuter slots. |
| **Screen 3** | `Group recommendation [SCREEN 3]` | Happy path showing 3 ranked recommendation cards with Rank 1 `BEST: Today 2:00–3:00 PM (4/4 free, ends 30 min before bus)` and `[Confirm]` button. |
| **Screen 4** | `Error and fallback [SCREEN 4]` | Actionable error state rendered when no mutual slots exist with a 30-min buffer, offering `[Suggest Tomorrow]` and `[Shorten to 30 min]`. |

---

## ⏱️ Core Commuter Transit Cutoff Logic

### The Rule
$$\text{Slot End Time} + \text{Transit Buffer (30 min)} > \text{Bus Cutoff Time (3:30 PM)}$$

Any slot violating this condition is **strictly marked as unviable and pre-disabled**.

### Concrete 1-Hour Schedule Example (Bus Cutoff: 3:30 PM):
* **2:00 PM – 3:00 PM**: **Viable** (Ends at 3:00 PM + 30 min buffer = 3:30 PM $\le$ 3:30 PM). Leaves a guaranteed 30-minute safe departure window.
* **3:00 PM – 4:00 PM**: **Incompatible & Pre-blocked** (Ends at 4:00 PM + 30 min buffer = 4:30 PM $>$ 3:30 PM cutoff). Locked with text badge: `"Pre-blocked: 3:30 PM transit cutoff"`.
* **4:00 PM – 5:00 PM**: **Incompatible & Pre-blocked** (Ends at 5:00 PM + 30 min buffer = 5:30 PM $>$ 3:30 PM cutoff). Locked with text badge: `"Pre-blocked: 3:30 PM transit cutoff"`.

---

## 🎨 Gestalt Principles (Project Annotations)

1. **Gestalt: Proximity & Contrast (Frame 1)**
   * *Proximity*: Binary `[Free]` and `[Busy]` toggles are located directly within their parent row, eliminating visual ambiguity over which block is modified.
   * *Contrast*: 3:00–5:00 PM blocks use low contrast, muted backgrounds, lock icons, and disabled cursor styling to communicate ineligibility before any click is attempted.

2. **Gestalt: Common Region (Frame 2)**
   * Bounded card containers for group meeting times and bus departure buffer form self-contained visual blocks.
   * Eliminates the cognitive overload of dense 2D calendar grids and allows commuters to evaluate options as distinct solutions.

---

## 🎯 8-State UI Matrix (HCI Criteria)

1. **Default**: Neutral resting buttons (`[Free]`, `[Busy]`) with balanced borders and clear typography.
2. **Hover / Focus**: 2px high-contrast emerald outline (`focus-visible:ring-2 focus-visible:ring-emerald-700`) adhering to WCAG 2.4.7.
3. **Active**: Instant visual feedback; pressed state highlighted in emerald with checkmark icon and `aria-pressed="true"`.
4. **Disabled**: Visually locked rows with HTML `disabled` attributes, `aria-disabled="true"`, lock icons, and unambiguous text badges.
5. **Loading**: Simulated constraint synthesis (`"Synthesizing team constraints..."`) with spinning loader and `aria-live` announcement.
6. **Empty**: Initial collection state (`"Availability requested · 0 of 4 replies"`) before input is provided.
7. **Error**: Actionable error card when no slots satisfy the buffer, with two direct recovery paths (`[Suggest Tomorrow]` and `[Shorten to 30 min]`).
8. **Success**: Locked meeting with pinned group banner and confirmed status.

---

## ♿ WCAG 2.1 AA Compliance Checklist

- **Color Contrast**: All text elements exceed the 4.5:1 ratio (Slate-900 `#0f172a` on white = `16.0:1`; Emerald-700 `#047857` button text = `5.2:1`).
- **Non-Color Dependent Encoding**: All critical states (`BEST`, `Unavailable`, `Pre-blocked: 3:30 PM transit cutoff`, `Selected: Free`) utilize explicit text labels and semantic icons in addition to color.
- **Keyboard Navigation**:
  - Full tab stop hierarchy through `<main>`, `<section>`, `<button>`, `<fieldset>`, `<legend>`.
  - Accessible Skip Link (`Skip to main content`).
  - Hotkeys:
    - `1`: Switch to Group Chat
    - `2`: Switch to Bilal's Private DM
    - `3`: Switch to Split View (Side-by-side)
    - `?`: Open Evaluator Guide & WCAG Checklist
    - `S`: Toggle Commuter Transit Settings
    - `R`: Reset Prototype
- **Live Regions**: Screen reader announcements via `aria-live="polite"` for chat messages and status changes.

