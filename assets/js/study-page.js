/* Motion Lab — Interactive Study Workbench controller (study.html?id=<slug>) */
(function () {
  "use strict";

  const studies = window.MOTION_STUDIES || [];
  const easings = window.MOTION_EASINGS || [];
  const params = new URLSearchParams(window.location.search);
  const reqId = params.get("id");
  const idx = Math.max(0, studies.findIndex((s) => s.id === reqId));
  const study = studies[idx];
  if (!study) return;

  document.title = `${study.title} — Motion Lab`;

  const elTitle = document.getElementById("study-title");
  const elTagline = document.getElementById("study-tagline");
  const elCat = document.getElementById("study-category");
  const elHint = document.getElementById("study-hint");
  const elTriggers = document.getElementById("study-triggers");
  const elNotes = document.getElementById("study-notes");
  const elStage = document.getElementById("study-stage");
  const elControls = document.getElementById("study-controls");
  const elLog = document.getElementById("study-log");
  const elTokens = document.getElementById("study-tokens-code");
  const elBezierSvg = document.getElementById("bezier-svg");
  const elBezierText = document.getElementById("bezier-text");
  const prevLink = document.getElementById("prev-study");
  const nextLink = document.getElementById("next-study");

  elTitle.textContent = study.title;
  elTagline.textContent = study.tagline;
  elCat.textContent = study.category;
  elHint.textContent = study.hint;
  elTriggers.textContent = `Triggers: ${study.triggers}`;
  elNotes.textContent = study.notes;

  const prev = studies[(idx - 1 + studies.length) % studies.length];
  const next = studies[(idx + 1) % studies.length];
  prevLink.href = `./study.html?id=${encodeURIComponent(prev.id)}`;
  prevLink.textContent = `← ${prev.title}`;
  nextLink.href = `./study.html?id=${encodeURIComponent(next.id)}`;
  nextLink.textContent = `${next.title} →`;

  function logEvent(msg) {
    const now = new Date();
    const ts = now.toTimeString().slice(0, 8);
    const row = document.createElement("div");
    row.textContent = `[${ts}] ${msg}`;
    elLog.prepend(row);
    while (elLog.children.length > 8) elLog.lastElementChild.remove();
  }

  const instance = window.MotionLabRuntime.mountStudy(study.id, elStage, logEvent);
  const currentVars = {};

  function parseCubic(str) {
    const m = /cubic-bezier\(([^)]+)\)/.exec(str || "");
    if (!m) return [0.22, 1, 0.36, 1];
    const nums = m[1].split(",").map((x) => parseFloat(x.trim()));
    return nums.length === 4 && nums.every((n) => !Number.isNaN(n)) ? nums : [0.22, 1, 0.36, 1];
  }

  function renderBezier(easingStr) {
    const [x1, y1, x2, y2] = parseCubic(easingStr);
    // Map [0..1] into SVG box (14..74 x, 72..22 y) allowing headroom for overshoot y > 1
    const sx = (v) => (14 + v * 60).toFixed(1);
    const sy = (v) => (72 - Math.min(1.35, Math.max(-0.2, v)) * 46).toFixed(1);
    elBezierSvg.innerHTML = `
      <rect x="14" y="26" width="60" height="46" rx="4" fill="none" stroke="var(--ml-border-strong)" stroke-dasharray="2 2"/>
      <line x1="${sx(0)}" y1="${sy(0)}" x2="${sx(x1)}" y2="${sy(y1)}" stroke="var(--ml-accent)" stroke-opacity="0.45" stroke-width="1.4"/>
      <line x1="${sx(1)}" y1="${sy(1)}" x2="${sx(x2)}" y2="${sy(y2)}" stroke="var(--ml-accent)" stroke-opacity="0.45" stroke-width="1.4"/>
      <path d="M ${sx(0)} ${sy(0)} C ${sx(x1)} ${sy(y1)}, ${sx(x2)} ${sy(y2)}, ${sx(1)} ${sy(1)}" fill="none" stroke="var(--ml-accent)" stroke-width="2.4" stroke-linecap="round"/>
      <circle cx="${sx(x1)}" cy="${sy(y1)}" r="3.2" fill="var(--ml-accent)"/>
      <circle cx="${sx(x2)}" cy="${sy(y2)}" r="3.2" fill="var(--ml-accent)"/>
    `;
    elBezierText.textContent = easingStr;
  }

  function updateTokenReadout() {
    const speed = elStage.style.getPropertyValue("--ml-speed") || "1";
    const lines = Object.entries(currentVars).map(([k, v]) => `  ${k}: ${v};`);
    if (speed !== "1") lines.push(`  /* workbench slow-mo factor: ${speed}x duration */`);
    elTokens.textContent = `.study-${study.id} {\n${lines.join("\n")}\n}`;
  }

  function buildControls() {
    elControls.innerHTML = "";
    study.controls.forEach((ctrl) => {
      const wrap = document.createElement("div");
      wrap.className = "ml-control";
      const valStr = ctrl.type === "range" ? `${ctrl.value}${ctrl.unit}` : ctrl.value;
      currentVars[ctrl.key] = valStr;
      instance.applyVar(ctrl.key, valStr);

      if (ctrl.type === "range") {
        wrap.innerHTML = `
          <div class="ml-control-label">
            <label for="ctrl-${ctrl.key}">${ctrl.label}</label>
            <span class="ml-control-val" data-val>${valStr}</span>
          </div>
          <input id="ctrl-${ctrl.key}" class="ml-range" type="range" min="${ctrl.min}" max="${ctrl.max}" step="${ctrl.step}" value="${ctrl.value}" />
        `;
        const inp = wrap.querySelector("input");
        const valEl = wrap.querySelector("[data-val]");
        inp.addEventListener("input", () => {
          const formatted = `${inp.value}${ctrl.unit}`;
          valEl.textContent = formatted;
          currentVars[ctrl.key] = formatted;
          instance.applyVar(ctrl.key, formatted);
          updateTokenReadout();
        });
      } else if (ctrl.type === "easing") {
        const opts = easings.map((e) => `<option value="${e.value}" ${e.value === ctrl.value ? "selected" : ""}>${e.name}</option>`).join("");
        wrap.innerHTML = `
          <div class="ml-control-label">
            <label for="ctrl-${ctrl.key}">${ctrl.label}</label>
          </div>
          <select id="ctrl-${ctrl.key}" class="ml-select">${opts}</select>
        `;
        const sel = wrap.querySelector("select");
        sel.addEventListener("change", () => {
          currentVars[ctrl.key] = sel.value;
          instance.applyVar(ctrl.key, sel.value);
          renderBezier(sel.value);
          updateTokenReadout();
          logEvent(`easing → ${sel.options[sel.selectedIndex].text}`);
        });
      }
      elControls.appendChild(wrap);
    });
    renderBezier(study.defaultEasing);
    updateTokenReadout();
  }

  // Speed multiplier controls (1x = speed 1, 0.5x = 2x duration, 0.25x = 4x duration)
  document.querySelectorAll("[data-speed]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const mult = btn.dataset.speed;
      elStage.style.setProperty("--ml-speed", mult);
      document.querySelectorAll("[data-speed]").forEach((b) => {
        b.setAttribute("aria-pressed", String(b === btn));
      });
      updateTokenReadout();
      logEvent(`playback speed → ${btn.textContent.trim()}`);
    });
  });

  // Reduced-motion simulator
  const rmBtn = document.getElementById("btn-reduced-motion");
  if (rmBtn) {
    rmBtn.addEventListener("click", () => {
      const on = elStage.classList.toggle("ml-reduced-motion");
      rmBtn.setAttribute("aria-pressed", String(on));
      logEvent(`reduced-motion simulator → ${on ? "ON" : "OFF"}`);
    });
  }

  // Replay / Trigger button
  const replayBtn = document.getElementById("btn-replay");
  if (replayBtn) {
    replayBtn.addEventListener("click", () => instance.trigger());
  }

  // Reset controls
  const resetBtn = document.getElementById("btn-reset-controls");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      elStage.style.setProperty("--ml-speed", "1");
      elStage.classList.remove("ml-reduced-motion");
      if (rmBtn) rmBtn.setAttribute("aria-pressed", "false");
      document.querySelectorAll("[data-speed]").forEach((b) => {
        b.setAttribute("aria-pressed", String(b.dataset.speed === "1"));
      });
      buildControls();
      logEvent("controls reset to study defaults");
    });
  }

  buildControls();
  logEvent(`mounted "${study.title}" workbench`);
})();
