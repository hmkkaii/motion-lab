/* Motion Lab v2.0 — Catalog of 8 Original Interactive UI Showcase Components */
window.MOTION_COMPONENTS = [
  {
    id: "pulse-climate",
    title: "Pulse Climate Dial",
    category: "Controls",
    tagline: "Circular architectural thermostat with 36 precision ticks, glowing conic arc, stepper controls, and ambient mood switcher.",
    triggers: "Click − / + · Switch Eco / Comfort / Warm Glow",
    tokens: "--ease-bounce: cubic-bezier(0.34, 1.36, 0.64, 1); --dur-dial: 300ms;",
    snippet: `<div class="pulse-dial">
  <!-- 36-tick SVG radial dial + tabular temp + 3-way sliding mood pill -->
  <!-- Motion: arc stroke-dasharray smoothly tracks (temp - 16) / 12 * 481 -->
  <!-- Mood pill thumb translates 0% / 100% / 200% with cubic-bezier(0.34, 1.36, 0.64, 1) -->
</div>`
  },
  {
    id: "orbit-flight",
    title: "Orbit Live Flight Pass",
    category: "Cards",
    tagline: "Cobalt aviation tracker with SVG great-circle flight path, pulsing radar plane indicator, and live boarding tab transition.",
    triggers: "Switch Live Route / Gate B14 / Boarding",
    tokens: "--ease-smooth-out: cubic-bezier(0.22, 1, 0.36, 1); --dur-tab: 300ms;",
    snippet: `<div class="orbit-pass">
  <!-- Quadratic Bezier path M 18 86 Q 230 -8 442 86 -->
  <!-- Aircraft transform interpolates tangent angle atan2(dy, dx) along progress t -->
</div>`
  },
  {
    id: "tempo-audio",
    title: "Tempo Spatial Audio Deck",
    category: "Media",
    tagline: "Obsidian hi-fi vinyl player with 18-bar animated harmonic equalizer and color-shifting Studio / Warm / Spatial sound presets.",
    triggers: "Play / Pause · Switch Studio / Warm / Spatial",
    tokens: "--dur-eq: 140ms; --ease-bounce: cubic-bezier(0.34, 1.36, 0.64, 1);",
    snippet: `<div class="tempo-deck">
  <!-- Play/Pause drives rotating vinyl sheen + 18 harmonic bars -->
  <!-- Presets reshape frequency bias & linear-gradient color spectrum -->
</div>`
  },
  {
    id: "chroma-mesh",
    title: "Chroma Palette Studio",
    category: "Creative",
    tagline: "Multi-layer radial mesh gradient studio with crossfading Solstice / Cobalt / Matcha themes, live OKLCH readout, and one-click CSS copy.",
    triggers: "Pick Swatch · Click Copy CSS",
    tokens: "--dur-mesh: 420ms; --ease-smooth-out: cubic-bezier(0.22, 1, 0.36, 1);",
    snippet: `<div class="chroma-studio">
  <!-- 3 stacked radial-gradient layers crossfade opacity 0 <-> 1 -->
  <!-- Live OKLCH + HEX token strip with instant clipboard feedback -->
</div>`
  },
  {
    id: "focus-timer",
    title: "Focus Deep Work Timer",
    category: "Productivity",
    tagline: "Warm-paper Pomodoro timer with smooth SVG countdown ring, tabular digits, and Rain / Vinyl / Forest ambient chips.",
    triggers: "Start / Pause Session · Toggle Ambient Sound Chips",
    tokens: "--dur-ring: 320ms; --ease-smooth-out: cubic-bezier(0.22, 1, 0.36, 1);",
    snippet: `<div class="focus-timer">
  <!-- SVG circle r=74 (circumference 465) animates stroke-dashoffset each second -->
  <!-- Session button morphs #1C1917 -> #DC5C3B with active status indicator -->
</div>`
  },
  {
    id: "forge-deploy",
    title: "Forge Edge Deploy Pipeline",
    category: "Developer",
    tagline: "Interactive deployment card that cascades through 4 staggered build stages with spring checkmarks and live edge latency status.",
    triggers: "Click Deploy Release / Redeploy",
    tokens: "--dur-step: 240ms; --stagger: 520ms; --ease-bounce: cubic-bezier(0.34, 1.36, 0.64, 1);",
    snippet: `<div class="forge-deploy">
  <!-- Click triggers 4 sequential build checks (Lint -> Bundle -> Edge CDN -> Live) -->
  <!-- Each check transitions neutral -> active violet -> done emerald with spring pop -->
</div>`
  },
  {
    id: "shelf-books",
    title: "Design Shelf 3D Deck",
    category: "Media",
    tagline: "Tactile Swiss graphic book cover-flow with perspective depth stacking, synced reading progress bar, and spring bookmark toggle.",
    triggers: "Click ‹ / › or Covers · Toggle Bookmark",
    tokens: "--dur-deck: 360ms; --ease-bounce: cubic-bezier(0.34, 1.36, 0.64, 1);",
    snippet: `<div class="shelf-deck">
  <!-- Relative offset rel = index - activeIndex drives translateX(rel*96px), scale(1-|rel|*0.16), rotate(-rel*8deg) -->
</div>`
  },
  {
    id: "relay-triage",
    title: "Relay Issue Triage Card",
    category: "Productivity",
    tagline: "Linear-inspired engineering issue card with interactive priority escalation, Ship PR state morph, QA bar fill, and reaction toggles.",
    triggers: "Toggle Priority · Click Ship PR · Toggle Reactions",
    tokens: "--dur-micro: 160ms; --ease-bounce: cubic-bezier(0.34, 1.36, 0.64, 1);",
    snippet: `<div class="relay-triage">
  <!-- Priority toggles Medium <-> Urgent; Ship PR morphs status badge & fills QA bar to 100% -->
  <!-- Reaction chips toggle active state & counter with overshoot spring -->
</div>`
  }
];
