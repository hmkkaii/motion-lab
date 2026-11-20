/* Motion Lab — Curated catalog of 12 original interactive UI motion studies */
window.MOTION_STUDIES = [
  {
    id: "adaptive-card",
    title: "Adaptive Card Resize",
    category: "Surfaces",
    tagline: "Smooth width and height continuity when a surface toggles density.",
    specLabel: "300ms · smooth-out",
    hint: "Click Toggle Size repeatedly (including mid-transition) to inspect smooth width/height reversal.",
    triggers: "Click / Mid-flight interrupt",
    defaultEasing: "cubic-bezier(0.22, 1, 0.36, 1)",
    controls: [
      { key: "--s-dur", label: "Duration", type: "range", min: 100, max: 900, step: 20, unit: "ms", value: 300 },
      { key: "--s-ease", label: "Easing Curve", type: "easing", value: "cubic-bezier(0.22, 1, 0.36, 1)" }
    ],
    notes: "Uses a decelerating smooth-out curve so layout changes feel responsive immediately on click and settle cleanly without bounce."
  },
  {
    id: "origin-menu",
    title: "Origin-Aware Action Menu",
    category: "Surfaces",
    tagline: "Anchored popover growing from its trigger with asymmetric open and close timings.",
    specLabel: "250ms in / 150ms out",
    hint: "Click Actions to open/close, pick an item, or click outside / rapidly toggle mid-open.",
    triggers: "Click / Outside dismiss / Interrupt",
    defaultEasing: "cubic-bezier(0.22, 1, 0.36, 1)",
    controls: [
      { key: "--s-open-dur", label: "Open Duration", type: "range", min: 100, max: 700, step: 10, unit: "ms", value: 250 },
      { key: "--s-close-dur", label: "Close Duration", type: "range", min: 60, max: 500, step: 10, unit: "ms", value: 150 },
      { key: "--s-pre-scale", label: "Open Start Scale", type: "range", min: 0.85, max: 0.99, step: 0.01, unit: "", value: 0.97 },
      { key: "--s-ease", label: "Easing Curve", type: "easing", value: "cubic-bezier(0.22, 1, 0.36, 1)" }
    ],
    notes: "Transform origin locks to top-center so the surface expands from its button; closing is 100ms faster with softer scale (0.99) to stay out of the user's way."
  },
  {
    id: "scale-dialog",
    title: "Focal Scale Dialog",
    category: "Surfaces",
    tagline: "Centered confirmation dialog pairing subtle 0.96 scale with a soft backdrop veil.",
    specLabel: "250ms in / 150ms out",
    hint: "Open the dialog, close via Cancel, backdrop click, or Escape key.",
    triggers: "Click / Backdrop / Escape",
    defaultEasing: "cubic-bezier(0.22, 1, 0.36, 1)",
    controls: [
      { key: "--s-open-dur", label: "Open Duration", type: "range", min: 100, max: 700, step: 10, unit: "ms", value: 250 },
      { key: "--s-close-dur", label: "Close Duration", type: "range", min: 60, max: 500, step: 10, unit: "ms", value: 150 },
      { key: "--s-scale", label: "Closed Scale", type: "range", min: 0.85, max: 0.99, step: 0.01, unit: "", value: 0.96 },
      { key: "--s-ease", label: "Easing Curve", type: "easing", value: "cubic-bezier(0.22, 1, 0.36, 1)" }
    ],
    notes: "Starting at 0.96 instead of 0.8 keeps focal modals crisp and architectural rather than cartoonish."
  },
  {
    id: "sliding-tabs",
    title: "Measured Sliding Tabs",
    category: "Navigation",
    tagline: "Segmented control whose active pill measures width and offset for fluid tracking.",
    specLabel: "250ms · measured pill",
    hint: "Click across tabs rapidly to observe mid-flight redirection without desynchronization.",
    triggers: "Click / Rapid interrupt",
    defaultEasing: "cubic-bezier(0.22, 1, 0.36, 1)",
    controls: [
      { key: "--s-dur", label: "Slide Duration", type: "range", min: 80, max: 700, step: 10, unit: "ms", value: 250 },
      { key: "--s-ease", label: "Easing Curve", type: "easing", value: "cubic-bezier(0.22, 1, 0.36, 1)" }
    ],
    notes: "Measures offsetLeft and offsetWidth of the target button on click and on ResizeObserver, keeping transform and width synchronized."
  },
  {
    id: "accordion-disclosure",
    title: "Grid-Row Accordion",
    category: "Navigation",
    tagline: "Intrinsic height disclosure driven by CSS grid-template-rows with synced chevron flip.",
    specLabel: "250ms · 0fr ↔ 1fr",
    hint: "Click either section header to expand, collapse, or reverse mid-animation.",
    triggers: "Click / Toggle / Interrupt",
    defaultEasing: "cubic-bezier(0.22, 1, 0.36, 1)",
    controls: [
      { key: "--s-dur", label: "Expand / Collapse", type: "range", min: 100, max: 700, step: 10, unit: "ms", value: 250 },
      { key: "--s-ease", label: "Easing Curve", type: "easing", value: "cubic-bezier(0.22, 1, 0.36, 1)" }
    ],
    notes: "Animates grid-template-rows from 0fr to 1fr without hardcoded max-height hacks, preserving exact content height."
  },
  {
    id: "page-transition",
    title: "Directional View Slide",
    category: "Navigation",
    tagline: "Forward and backward drill-down view swap with directional offset and cross-blur.",
    specLabel: "250ms · ±10px + 3px blur",
    hint: "Select any item to slide forward, then click Back to reverse direction.",
    triggers: "Click Forward / Back",
    defaultEasing: "cubic-bezier(0.22, 1, 0.36, 1)",
    controls: [
      { key: "--s-dur", label: "Transition Duration", type: "range", min: 100, max: 700, step: 10, unit: "ms", value: 250 },
      { key: "--s-dist", label: "Slide Distance", type: "range", min: 4, max: 32, step: 2, unit: "px", value: 10 },
      { key: "--s-blur", label: "Cross Blur", type: "range", min: 0, max: 8, step: 0.5, unit: "px", value: 3 },
      { key: "--s-ease", label: "Easing Curve", type: "easing", value: "cubic-bezier(0.22, 1, 0.36, 1)" }
    ],
    notes: "Short spatial displacement paired with mild blur communicates hierarchy direction without causing motion fatigue."
  },
  {
    id: "toast-stack",
    title: "Stacked Notification Banners",
    category: "Feedback",
    tagline: "Three-deep notification deck that rises in, recedes with depth blur, and fans on hover.",
    specLabel: "350ms in · Hover fan-out",
    hint: "Click Push Notice to add cards (capped 3 deep) and hover the stack to expand all items.",
    triggers: "Click Push / Hover spread",
    defaultEasing: "cubic-bezier(0.22, 1, 0.36, 1)",
    controls: [
      { key: "--s-open", label: "Stack Transition", type: "range", min: 120, max: 750, step: 10, unit: "ms", value: 350 },
      { key: "--s-ease", label: "Easing Curve", type: "easing", value: "cubic-bezier(0.22, 1, 0.36, 1)" }
    ],
    notes: "Receding cards scale down by 6% per layer with progressive opacity and blur, then unfold cleanly into a full list on hover."
  },
  {
    id: "validation-shake",
    title: "Segmented Validation Shake",
    category: "Feedback",
    tagline: "Tactile horizontal rejection shake on invalid input with automatic neutral recovery.",
    specLabel: "280ms shake · 3s auto-revert",
    hint: "Click Validate Invalid to trigger the shake & error hint; type or wait 3s for clean auto-revert.",
    triggers: "Click / Auto-revert / Input",
    defaultEasing: "cubic-bezier(0.22, 1, 0.36, 1)",
    controls: [
      { key: "--s-dur", label: "Shake Duration", type: "range", min: 140, max: 600, step: 20, unit: "ms", value: 280 },
      { key: "--s-dist", label: "Amplitude", type: "range", min: 2, max: 14, step: 1, unit: "px", value: 6 },
      { key: "--s-ease", label: "Easing Curve", type: "easing", value: "cubic-bezier(0.22, 1, 0.36, 1)" }
    ],
    notes: "Decaying horizontal oscillations mimic physical rejection while automatically clearing transient error highlights once acknowledged."
  },
  {
    id: "confirm-check",
    title: "Composed Success Check",
    category: "Feedback",
    tagline: "Multi-track celebration combining fade, rotate, vertical bounce, de-blur, and SVG stroke draw.",
    specLabel: "500ms · 80ms stroke delay",
    hint: "Click Replay Check to fire all five synchronized animation tracks.",
    triggers: "Click Replay / Reset",
    defaultEasing: "cubic-bezier(0.22, 1, 0.36, 1)",
    controls: [
      { key: "--s-dur", label: "Master Duration", type: "range", min: 200, max: 1100, step: 20, unit: "ms", value: 500 },
      { key: "--s-delay", label: "Stroke Delay", type: "range", min: 0, max: 250, step: 10, unit: "ms", value: 80 },
      { key: "--s-ease", label: "Main Easing", type: "easing", value: "cubic-bezier(0.22, 1, 0.36, 1)" }
    ],
    notes: "Delaying the SVG checkmark stroke by 80ms lets the circular badge establish presence before the tick draws itself."
  },
  {
    id: "spring-like",
    title: "Spring Heart & Particle Burst",
    category: "Micro-Motion",
    tagline: "Overshoot spring pop paired with a nine-particle radial burst on positive toggle.",
    specLabel: "350ms pop · 600ms burst",
    hint: "Click Like to fire the overshoot pop and radial particles; click again to toggle off cleanly.",
    triggers: "Click / Double-click safe",
    defaultEasing: "cubic-bezier(0.34, 1.96, 0.64, 1)",
    controls: [
      { key: "--s-pop", label: "Heart Pop", type: "range", min: 150, max: 700, step: 10, unit: "ms", value: 350 },
      { key: "--s-particle", label: "Particle Burst", type: "range", min: 250, max: 1100, step: 25, unit: "ms", value: 600 },
      { key: "--s-ease", label: "Pop Easing", type: "easing", value: "cubic-bezier(0.34, 1.96, 0.64, 1)" }
    ],
    notes: "Asymmetry applies to micro-feedback too: liking celebrates with particles and overshoot while unliking stays quiet and immediate."
  },
  {
    id: "drum-counter",
    title: "3D Drum Counter",
    category: "Micro-Motion",
    tagline: "Selective digit-roll counter where only changed digits animate with blur and stagger.",
    specLabel: "520ms · 40ms stagger",
    hint: "Click +12, +135, or -24 to watch unchanged columns stay rock-solid while updated digits pop.",
    triggers: "Click +12 / +135 / -24",
    defaultEasing: "cubic-bezier(0.34, 1.36, 0.64, 1)",
    controls: [
      { key: "--s-dur", label: "Digit Enter", type: "range", min: 200, max: 1000, step: 20, unit: "ms", value: 520 },
      { key: "--s-stagger", label: "Column Stagger", type: "range", min: 0, max: 120, step: 10, unit: "ms", value: 40 },
      { key: "--s-blur", label: "Motion Blur", type: "range", min: 0, max: 6, step: 0.5, unit: "px", value: 2.5 },
      { key: "--s-ease", label: "Landing Easing", type: "easing", value: "cubic-bezier(0.34, 1.36, 0.64, 1)" }
    ],
    notes: "Direction follows value sign (+ rises from below, - drops from above) and tabular numerals prevent horizontal layout jitter."
  },
  {
    id: "hover-cluster",
    title: "Magnetic Avatar Wave & 3D Tilt",
    category: "Micro-Motion",
    tagline: "Distance-falloff hover lift with bouncy return paired with pointer-tracked 3D card tilt.",
    specLabel: "320ms wave · 3D glare",
    hint: "Sweep across the avatar stack for neighbor falloff, then glide over the dark pass card for 3D tilt.",
    triggers: "Hover / Pointermove / Leave",
    defaultEasing: "cubic-bezier(0.34, 3.85, 0.64, 1)",
    controls: [
      { key: "--s-dur", label: "Avatar Lift", type: "range", min: 140, max: 700, step: 20, unit: "ms", value: 320 },
      { key: "--s-lift", label: "Peak Lift", type: "range", min: -14, max: -2, step: 1, unit: "px", value: -6 },
      { key: "--s-return", label: "Tilt Settle", type: "range", min: 250, max: 1400, step: 50, unit: "ms", value: 850 }
    ],
    notes: "Neighbor displacement decays exponentially (0.45^distance) on hover-in and snaps back with a lively spring curve on mouse leave."
  }
];

window.MOTION_EASINGS = [
  { name: "Smooth Out (Primary)", value: "cubic-bezier(0.22, 1, 0.36, 1)", p: [0.22, 1, 0.36, 1] },
  { name: "Bounce Pop", value: "cubic-bezier(0.34, 1.36, 0.64, 1)", p: [0.34, 1.36, 0.64, 1] },
  { name: "Like Overshoot", value: "cubic-bezier(0.34, 1.96, 0.64, 1)", p: [0.34, 1.96, 0.64, 1] },
  { name: "Strong Spring Return", value: "cubic-bezier(0.34, 3.85, 0.64, 1)", p: [0.34, 3.85, 0.64, 1] },
  { name: "Ease In-Out", value: "cubic-bezier(0.42, 0, 0.58, 1)", p: [0.42, 0, 0.58, 1] },
  { name: "Sharp Ease Out", value: "cubic-bezier(0, 0, 0.2, 1)", p: [0, 0, 0.2, 1] }
];
