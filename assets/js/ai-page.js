/* Motion Lab v2.0 — Skill & MCP Hub Controller (ai.html) */
(function () {
  "use strict";

  document.querySelectorAll("[data-copy-target]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.copyTarget;
      const el = document.getElementById(targetId);
      if (!el || !window.MotionLabApp) return;
      const label = btn.dataset.copyLabel || "snippet";
      window.MotionLabApp.copyText(el.textContent.trim(), `Copied ${label}`);
    });
  });
})();
