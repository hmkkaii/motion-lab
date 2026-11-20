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

  function render() {
    listEl.innerHTML = window.MOTION_EASINGS.map((e, i) => `
      <div class="ml-track-row">
        <div class="ml-track-head">
          <strong>${e.name}</strong>
          <code style="font-family:var(--ml-font-mono);font-size:12px;color:var(--ml-ink-secondary);">${e.value}</code>
        </div>
        <div class="ml-track-rail" data-rail>
          <div class="ml-track-puck" data-puck="${i}" style="transition: transform ${duration}ms ${e.value};"></div>
        </div>
      </div>
    `).join("");
  }

  function runRace() {
    atEnd = !atEnd;
    listEl.querySelectorAll("[data-rail]").forEach((rail) => {
      const puck = rail.querySelector("[data-puck]");
      const travel = Math.max(0, rail.clientWidth - 34);
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

  runBtn.addEventListener("click", runRace);
  render();
})();
