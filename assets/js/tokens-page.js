/* Motion Lab — Interactive Easing Curve Race Track (tokens.html) */
(function () {
  "use strict";

  const listEl = document.getElementById("race-tracks");
  const runBtn = document.getElementById("btn-run-race");
  const durInput = document.getElementById("race-duration");
  const durVal = document.getElementById("race-duration-val");
  if (!listEl || !window.MOTION_EASINGS) return;

  let atEnd = false;
  let duration = 650;
  // Reserve 50% right-side headroom inside each rail so even Strong Spring Return (y2=3.85, peak ~1.88x) stays 100% visible inside the rail with zero clipping
  const TARGET_RATIO = 0.50;

  function render() {
    listEl.innerHTML = window.MOTION_EASINGS.map((e, i) => `
      <div class="ml-track-row">
        <div class="ml-track-head">
          <strong>${e.name}</strong>
          <code style="font-family:var(--ml-font-mono);font-size:12px;color:var(--ml-ink-secondary);">${e.value}</code>
        </div>
        <div class="ml-track-rail" data-rail>
          <div class="ml-track-finish" data-finish aria-hidden="true"></div>
          <div class="ml-track-puck" data-puck="${i}" style="transition: transform ${duration}ms ${e.value};"></div>
        </div>
      </div>
    `).join("");
    syncFinishMarkers(true);
  }

  function calcTravel(rail) {
    return Math.max(0, Math.round((rail.clientWidth - 36) * TARGET_RATIO));
  }

  function syncFinishMarkers(repositionPucks) {
    listEl.querySelectorAll("[data-rail]").forEach((rail) => {
      const travel = calcTravel(rail);
      const finish = rail.querySelector("[data-finish]");
      if (finish) finish.style.left = `${travel + 17}px`;
      if (repositionPucks && atEnd) {
        const puck = rail.querySelector("[data-puck]");
        if (puck) {
          puck.style.transitionDuration = "0ms";
          puck.style.transform = `translateX(${travel}px)`;
          void puck.offsetWidth;
          puck.style.transitionDuration = `${duration}ms`;
        }
      }
    });
  }

  function runRace() {
    atEnd = !atEnd;
    listEl.querySelectorAll("[data-rail]").forEach((rail) => {
      const puck = rail.querySelector("[data-puck]");
      const travel = calcTravel(rail);
      puck.style.transitionDuration = `${duration}ms`;
      puck.style.transform = atEnd ? `translateX(${travel}px)` : "translateX(0px)";
    });
    runBtn.textContent = atEnd ? "Return All Curves" : "Launch Race";
  }

  if (durInput) {
    durInput.addEventListener("input", () => {
      duration = Number(durInput.value);
      durVal.textContent = `${duration}ms`;
    });
  }

  window.addEventListener("resize", () => syncFinishMarkers(true));
  runBtn.addEventListener("click", runRace);

  const copyTokensBtn = document.getElementById("btn-copy-tokens");
  if (copyTokensBtn) {
    const rootCss = [
      ":root {",
      "  --ml-speed: 1;",
      "  --duration-stagger: 40ms;",
      "  --duration-micro: 80ms;",
      "  --duration-quick: 150ms;",
      "  --duration-fast: 250ms;",
      "  --duration-medium: 350ms;",
      "  --duration-slow: 400ms;",
      "  --duration-very-slow: 500ms;",
      "",
      "  --ease-smooth-out: cubic-bezier(0.22, 1, 0.36, 1);",
      "  --ease-bounce: cubic-bezier(0.34, 1.36, 0.64, 1);",
      "  --ease-pop: cubic-bezier(0.34, 1.96, 0.64, 1);",
      "  --ease-bounce-strong: cubic-bezier(0.34, 3.85, 0.64, 1);",
      "  --ease-in-out: cubic-bezier(0.42, 0, 0.58, 1);",
      "  --ease-out: cubic-bezier(0, 0, 0.2, 1);",
      "}"
    ].join("\n");
    copyTokensBtn.addEventListener("click", () => {
      if (window.MotionLabApp) {
        window.MotionLabApp.copyText(rootCss, "Copied :root motion tokens");
      }
    });
  }

  render();
})();
