/* Motion Lab — Shared shell (theme persistence, mobile drawer, header chrome) */
(function () {
  "use strict";

  const THEME_KEY = "motion-lab:theme";

  function applyTheme(theme) {
    const resolved = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", resolved);
    try {
      localStorage.setItem(THEME_KEY, resolved);
    } catch (_) {}
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      const label = resolved === "dark" ? "Light" : "Dark";
      btn.setAttribute("aria-label", `Switch to ${label} theme`);
      const span = btn.querySelector("[data-theme-label]");
      if (span) span.textContent = label;
    });
  }

  function initTheme() {
    let saved = null;
    try {
      saved = localStorage.getItem(THEME_KEY);
    } catch (_) {}
    if (saved === "dark" || saved === "light") {
      applyTheme(saved);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      applyTheme("dark");
    } else {
      applyTheme("light");
    }
  }

  function initChrome() {
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme");
        applyTheme(current === "dark" ? "light" : "dark");
      });
    });

    const menuBtn = document.querySelector("[data-mobile-menu-btn]");
    const mobileNav = document.querySelector("[data-mobile-nav]");
    if (menuBtn && mobileNav) {
      menuBtn.addEventListener("click", () => {
        const open = mobileNav.classList.toggle("is-open");
        menuBtn.setAttribute("aria-expanded", String(open));
      });
    }
  }

  initTheme();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChrome);
  } else {
    initChrome();
  }

  window.MotionLabApp = { applyTheme };
})();
