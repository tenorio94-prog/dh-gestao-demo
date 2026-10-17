---
name: Hydro Fleet Operations
colors:
  surface: '#f0fbff'
  surface-dim: '#d1dcdf'
  surface-bright: '#f0fbff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eaf6f9'
  surface-container: '#e4f0f3'
  surface-container-high: '#dfeaed'
  surface-container-highest: '#d9e4e8'
  on-surface: '#131d20'
  on-surface-variant: '#3e494a'
  inverse-surface: '#283235'
  inverse-on-surface: '#e7f3f6'
  outline: '#6f797a'
  outline-variant: '#bec8ca'
  surface-tint: '#006972'
  primary: '#00535b'
  on-primary: '#ffffff'
  primary-container: '#006d77'
  on-primary-container: '#9becf7'
  inverse-primary: '#82d3de'
  secondary: '#006a62'
  on-secondary: '#ffffff'
  secondary-container: '#70f8e8'
  on-secondary-container: '#007168'
  tertiary: '#892900'
  on-tertiary: '#ffffff'
  tertiary-container: '#b23700'
  on-tertiary-container: '#ffd5c8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9ff0fb'
  primary-fixed-dim: '#82d3de'
  on-primary-fixed: '#001f23'
  on-primary-fixed-variant: '#004f56'
  secondary-fixed: '#70f8e8'
  secondary-fixed-dim: '#4fdbcc'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#ffdbd0'
  tertiary-fixed-dim: '#ffb59d'
  on-tertiary-fixed: '#390c00'
  on-tertiary-fixed-variant: '#832600'
  background: '#f0fbff'
  on-background: '#131d20'
  surface-variant: '#d9e4e8'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '800'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-plate:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '800'
    lineHeight: 20px
    letterSpacing: 1.5px
  label-numeral:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '800'
    lineHeight: 24px
  label-button:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.2px
  label-tag:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '800'
    lineHeight: 14px
    letterSpacing: 0.5px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 1.75rem
---

## Brand & Style

The design system addresses the fast-paced, high-friction operational environment of automotive detailing and car wash facilities across Brazil. The operator works in bright sunlight, open garage bays, and high humidity, frequently navigating the interface with wet hands or on the move. The emotional tone combines clean aquatic freshness, operational precision, and unmistakable legibility under direct glare.

The visual direction fuses **Modern Utility with Fresh Aquatic Nuance**:
- **Tactile Clarity:** Oversized, confident touch boundaries (minimum 48px to 56px heights), high-contrast data readouts, and immediate color signifiers that communicate car bay status at an arm's length.
- **Aquatic Gloss & Air:** Soft translucent glass cards, refreshing oceanic depths, and luminous mint highlights that evoke clean running water, polished clear-coats, and high-standard vehicle care.
- **Pragmatic Brazilian Context:** Native automotive elements, including official Mercosul license plate badges with precise typographic fidelity, ensuring instant recognition on the shop floor.

## Colors

The palette balances refreshing aquatic hues with an unmistakable energetic trigger color for yard operations.

- **Primary Teal (`#006D77`):** Represents deep, pure water and technical confidence. Used for primary navigation, critical summary containers, key status icons, and top-level brand chrome.
- **Secondary Aqua (`#2EC4B6`):** Evokes fresh rinsing water and surface gloss. Drives secondary actions, active tabs, progress fill meters, and interactive micro-highlights.
- **Tertiary Coral Sun (`#FF6B35`):** High-priority call-to-action engine. Deployed strictly for instant field triggers (e.g., "+ Novo Veículo", "Iniciar Lavagem", "Finalizar"), immediate alerts, and critical payment reminders visible under harsh sunlight.
- **Neutral Ground (`#5A6568`):** Deep oceanic charcoal used for high-readability body copy, technical labels, and border delineation, grounded over an airy ice-white canvas (`#F4F9F9`).

### Operational Status Palette
- **Aguardando (Queue):** Warm Amber (`#D97706`) with tinted container (`#FEF3C7`).
- **Lavando (In Progress):** Electric Aqua (`#0284C7`) with soft pulse indicator (`#E0F2FE`).
- **Pronto (Completed):** Vivid Emerald (`#059669`) with check badge (`#D1FAE5`).
- **Entregue / Pago (Settled):** Deep Indigo Slate (`#4338CA`) with badge (`#EEF2FF`).
- **Mercosul Blue:** Institutional Flag Blue (`#003399`) applied exclusively to the top header band of vehicle registration plates.

## Typography

The type system prioritizes split-second legibility. **Plus Jakarta Sans** provides open counters, tall x-heights, and crisp geometric terminals that do not degrade when viewed outdoors through water-splashed screens. 

- **Numerical Hierarchy:** Operational figures (revenue counters, queue wait times, bay numbers) are rendered at `fontWeight: 800` to prevent misinterpretation in direct sunlight.
- **License Plate Typography:** Dedicated token `label-plate` leverages **JetBrains Mono** in full uppercase with expanded letter-spacing (`1.5px`) to mirror Brazilian Mercosul stamping with absolute clarity.
- **Touch Target Typography:** Interactive triggers prioritize `label-button` at 16px Bold, avoiding delicate weights that get lost during rapid taps.

## Layout & Spacing

Designed primarily for single-hand mobile utilization within a 360x800 logical viewport:

- **Layout Structure:** 4-column fluid mobile grid anchored by `1rem` (16px) margins and gutters, maximizing usable horizontal density while avoiding accidental edge-taps when holding devices with damp thumbs.
- **Touch Perimeter Discipline:** Interactive triggers, operational status pills, and card tap regions must provide an explicit minimum dimension of 48px, with high-velocity primary actions standardized at 56px height.
- **Rhythm & Padding:** Component internal padding uses `space-md` (12px) for compact data modules and `space-lg` (20px) for primary touch cards. Stacked operational lists enforce a minimum vertical gap of `space-sm` (8px) to eliminate mis-taps between consecutive vehicles.

## Elevation & Depth

Visual depth is achieved through clean, watery surface layers combined with low-contrast oceanic tinting rather than heavy, dirty drop shadows:

- **Surface Layers:**
  - Base canvas: `#F4F9F9` (cool, fresh off-white).
  - Elevated cards: `#FFFFFF` (100% white) paired with a subtle aquatic border (`1px solid #E0EDED`).
  - Active/Working container: Soft frosted wash with 90% opacity white over secondary aqua tints.
- **Shadow System:**
  - **Ambient Rest:** `0 2px 8px -2px rgba(0, 109, 119, 0.08)` — subtle lift with an oceanic undertone.
  - **Floating Action Button / Active Modals:** `0 8px 24px -4px rgba(255, 107, 53, 0.35)` — warm, energetic cast for the primary coral CTA, separating the trigger cleanly from the lower interface tiers.
  - **Plate & Badge Inset:** `inset 0 1px 2px rgba(0, 0, 0, 0.06)` — gives physical stamping depth to car plates and bay markers.

## Shapes

The shape vocabulary uses friendly, modern, and ergonomic radii that feel polished and hydrodynamic:

- **Standard Containers (`rounded-md`, 0.5rem / 8px):** Applied to badges, table blocks, and system controls.
- **Operational Cards (`rounded-lg`, 1rem / 16px):** Applied to vehicle bay cards, customer queue rows, and metrics tiles.
- **Interactive Triggers & Modals (`rounded-xl`, 1.5rem / 24px):** Applied to floating bottom sheets, input fields, and dynamic CTAs.
- **Pill Badges:** Fully rounded (`rounded-full`, 9999px) applied to live status indicators and quick-filter chips.

## Components

### 1. Mercosul License Plate Badge
- **Dimensions & Structure:** Fixed border-radius (`6px`), white background with a thin outer stroke (`#003399`).
- **Header Strip:** Top solid stripe in `#003399` (height 10px to 12px) containing the micro-text "BRASIL" centered with a miniature Brazilian flag motif on the right.
- **Plate Identifier:** Centered `label-plate` text in `#111827`, monospaced uppercase (e.g., `BRA2E19`). Delivers zero ambiguity between letter "O" and digit "0".

### 2. Primary Yard Action Buttons (CTAs)
- **Primary Trigger:** 56px minimum height. Coral Sun (`#FF6B35`) fill with pure white typography. Prominent icon prefix (+ icon). Subtle rounded corner (`16px`).
- **Secondary Action:** 48px height. Pale Teal surface (`#E6F4F4`), Deep Teal text (`#006D77`), no border.
- **Destructive/Void:** 48px height. Soft Rose background (`#FEE2E2`) with Crimson text (`#B91C1C`).

### 3. Vehicle Operational Card
- **Layout:** High-density card containing three critical zones:
  1. Top Row: Mercosul Plate Badge on the left; Bay/Queue time counter on the right.
  2. Middle Row: Vehicle Model (e.g., "Compass Preto"), Service Type ("Lavagem Completa + Cera"), and Value.
  3. Bottom Row: Big Full-Width Touch Status Pill (e.g., "Aguardando" -> "Iniciar Lavagem").
- **Visual State:** Card receives a 3px solid left-border tint matching the vehicle's current status color.

### 4. Status Chips & Badges
- **Queue State:** Rounded pill with internal glowing dot. 
  - *Lavando:* `#0284C7` background at 12% opacity, saturated aqua text, animated subtle pulsing dot to signify work in progress.
  - *Pronto:* Emerald solid pill with bold check icon for instant driver dispatch.

### 5. Quick Input Fields (Pátio Mode)
- **Ergonomics:** 52px height minimum. Large, bold input font (18px) designed for single-hand keyboard entry.
- **States:** Default border `#D1E2E4`, Active focus border `#006D77` with 2px aquatic halo. Quick-clear (X) touch button oversized to 40x40px for wet thumbs.

### 6. Bay Grid Selector
- **Structure:** Horizontal snap-scroller or 2-column chunky grid tiles.
- **Information:** Bay number (e.g., "BOX 01"), operator assigned, and estimated time remaining with a prominent circular progress track in `#2EC4B6`.