---
name: motion-lab
description: Apply Motion Lab's interactive UI motion tokens, 12 motion studies, and 8 tactile UI components when building or polishing web interfaces in HTML/CSS/JS, React, Vue, or Svelte. Use when adding responsive transitions, dialogs, popovers, sliding tabs, accordions, toasts, counters, or high-craft interactive widgets.
---

# Motion Lab — Interactive UI Motion & Component Skill

Use this skill whenever building, refining, or reviewing UI transitions, micro-interactions, or interactive widgets so interfaces feel crisp, interruptible, and accessible.

- **Live Playground**: https://hmkkaii.github.io/motion-lab/
- **Machine Registry**: https://hmkkaii.github.io/motion-lab/registry.json
- **LLM Index**: https://hmkkaii.github.io/motion-lab/llms.txt
- **Full Single-File Reference**: https://hmkkaii.github.io/motion-lab/llms-full.txt

---

## 1. Core Motion Tokens (Default Palette)

Include these semantic tokens in `:root` and reference them instead of arbitrary ad-hoc easings:

```css
:root {
  --ml-speed: 1;
  --duration-stagger: 40ms;
  --duration-micro: 80ms;
  --duration-quick: 150ms;
  --duration-fast: 250ms;
  --duration-medium: 350ms;
  --duration-slow: 400ms;
  --duration-very-slow: 500ms;

  --ease-smooth-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-bounce: cubic-bezier(0.34, 1.36, 0.64, 1);
  --ease-pop: cubic-bezier(0.34, 1.96, 0.64, 1);
  --ease-bounce-strong: cubic-bezier(0.34, 3.85, 0.64, 1);
  --ease-in-out: cubic-bezier(0.42, 0, 0.58, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
}
```

## 2. Five Engineering Rules

1. **Asymmetric Open / Close Timings**: Open surfaces at `250ms` (`--duration-fast`) and dismiss/close faster at `150ms` (`--duration-quick`) with subtler scale (`0.96–0.99`) so dismissing UI never blocks the user.
2. **Smooth-Out Default, Restrained Overshoot**: Use `--ease-smooth-out` for layout resizes, dialogs, menus, tabs, accordions, and view swaps. Reserve `--ease-bounce` / `--ease-pop` strictly for small tactile controls (segmented thumbs, like hearts, checkmarks, dial knobs).
3. **Mid-Flight Interrupt Safety**: Prefer CSS transitions over fixed JS animation loops when state can flip rapidly (tabs, accordions, popovers, card resize). Always clear pending `setTimeout` / `setInterval` handles and clean up `document` listeners or `ResizeObserver` on unmount.
4. **Reduced Motion Compliance**: Always include `@media (prefers-reduced-motion: reduce)` CSS guards **and** check `window.matchMedia("(prefers-reduced-motion: reduce)").matches` inside JS pointer-tracking or particle/timer effects.
5. **Zero Layout Jitter**: Apply `font-variant-numeric: tabular-nums` to all animated counters, timers, temperatures, and percentages. Use `grid-template-rows: 0fr -> 1fr` instead of hardcoded `max-height` hacks for accordions.

---

## 3. Catalog Index (20 Live Building Blocks)

### 12 Motion Studies (`get_motion_spec(id)` via MCP or `registry.json`)
- **Surfaces**: `adaptive-card` (300ms width/height continuity), `origin-menu` (250ms/150ms anchored popover + Escape/outside dismiss), `scale-dialog` (250ms/150ms 0.96 focal modal)
- **Navigation**: `sliding-tabs` (250ms measured active pill + ResizeObserver), `accordion-disclosure` (250ms `0fr <-> 1fr` grid row), `page-transition` (250ms ±10px + 3px cross-blur)
- **Feedback**: `toast-stack` (350ms 3-deep stack + hover/tap fan-out), `validation-shake` (280ms decaying shake + 3s auto-revert), `confirm-check` (500ms multi-track badge + 80ms delayed SVG tick draw)
- **Micro-Motion**: `spring-like` (350ms overshoot heart + 9-particle radial burst), `drum-counter` (520ms selective digit roll + 40ms stagger), `hover-cluster` (320ms `0.45^distance` avatar wave + 3D pointer tilt glare)

### 8 Interactive UI Components (`get_component_code(id)` via MCP or `registry.json`)
- **Controls**: `pulse-climate` (36-tick SVG radial thermostat + glowing arc + 3-way mood pill)
- **Cards**: `orbit-flight` (cobalt great-circle Bezier flight tracker + tangent aircraft indicator + tabs)
- **Media**: `tempo-audio` (vinyl player + 18-bar harmonic EQ + Studio/Warm/Spatial presets), `shelf-books` (3D cover-flow deck + reading progress + bookmark toggle)
- **Creative**: `chroma-mesh` (3-layer crossfading radial mesh studio + live OKLCH/HEX + copy CSS)
- **Productivity**: `focus-timer` (SVG countdown ring + ambient sound chips), `relay-triage` (Linear-style issue card + priority escalation + Ship PR morph + reactions)
- **Developer**: `forge-deploy` (4-stage staggered edge deployment pipeline + spring checkmarks)

---

## 4. How to Retrieve Exact Code

- **With Motion Lab MCP connected**: Call `list_motions`, `get_motion_spec`, `list_components`, `get_component_code`, or `get_easing_tokens` directly.
- **Without MCP (Web / Local Clone)**: Fetch `https://hmkkaii.github.io/motion-lab/registry.json` (or `llms-full.txt`) and adapt the returned zero-dependency HTML/CSS/JS cleanly into the target project's stack (Vanilla JS, React, Tailwind, Vue, or Svelte) while preserving exact easing curves, asymmetric durations, ARIA attributes, and reduced-motion guards.
