/* Motion Lab v2.0 — Components Gallery Page Controller (components.html) */
(function () {
  "use strict";

  const grid = document.getElementById("ml-components-grid");
  const filterWrap = document.getElementById("ml-comp-filters");
  const countBadge = document.getElementById("ml-comp-count");
  if (!grid || !window.MOTION_COMPONENTS) return;

  const categories = ["All", "Controls", "Cards", "Media", "Creative", "Productivity", "Developer"];
  let activeCat = "All";
  let mounted = [];

  function buildAiPrompt(comp) {
    return [
      `Build an interactive UI component inspired by Motion Lab "${comp.title}" (${comp.id}).`,
      `Summary: ${comp.tagline}`,
      `Interactions: ${comp.triggers}`,
      `Motion Tokens: ${comp.tokens}`,
      `Full CSS/JS Source: https://hmkkaii.github.io/motion-lab/registry.json (or call MCP tool get_component_code with id="${comp.id}").`,
      `Requirements:`,
      `- Pure semantic HTML/CSS/JS (or adapt cleanly to current project framework) with zero layout shift.`,
      `- Respect prefers-reduced-motion and full keyboard accessibility (buttons/tabs/ARIA states).`,
      `- Match tactile spring feedback and crisp visual hierarchy.`,
      `Reference Structure:\n${comp.snippet}`
    ].join("\n");
  }

  function renderFilters() {
    if (!filterWrap) return;
    filterWrap.innerHTML = categories.map((cat) => {
      const cnt = cat === "All"
        ? window.MOTION_COMPONENTS.length
        : window.MOTION_COMPONENTS.filter((c) => c.category === cat).length;
      return `<button type="button" class="ml-pill" data-cat="${cat}" aria-pressed="${cat === activeCat}">${cat} (${cnt})</button>`;
    }).join("");

    filterWrap.querySelectorAll("[data-cat]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeCat = btn.dataset.cat;
        filterWrap.querySelectorAll("[data-cat]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.cat === activeCat)));
        renderGrid();
      });
    });
  }

  function renderGrid() {
    mounted.forEach((m) => m && m.destroy && m.destroy());
    mounted = [];

    const list = activeCat === "All"
      ? window.MOTION_COMPONENTS
      : window.MOTION_COMPONENTS.filter((c) => c.category === activeCat);

    if (countBadge) countBadge.textContent = `${list.length} / ${window.MOTION_COMPONENTS.length}`;
    grid.innerHTML = "";

    list.forEach((comp) => {
      const card = document.createElement("article");
      card.className = "ml-comp-shell";
      card.id = comp.id;
      card.dataset.compId = comp.id;
      const aiPrompt = buildAiPrompt(comp);
      card.innerHTML = `
        <div class="ml-comp-stage" data-stage></div>
        <div class="ml-comp-foot">
          <div class="ml-comp-foot-top">
            <h2 class="ml-comp-title">${comp.title}</h2>
            <span class="ml-badge">${comp.category}</span>
          </div>
          <p class="ml-comp-desc">${comp.tagline}</p>
          <div class="ml-comp-actions">
            <span class="ml-card-spec">${comp.triggers}</span>
            <div class="ml-comp-btn-group">
              <button type="button" class="ml-mini-btn" data-toggle-code aria-expanded="false">Spec</button>
              <button type="button" class="ml-mini-btn is-accent" data-copy-ai>Copy for AI</button>
            </div>
          </div>
        </div>
        <div class="ml-code-drawer is-hidden" data-drawer>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-size:12px;font-weight:600">
            <span>AI Prompt &amp; Motion Tokens (${comp.id})</span>
            <a href="./ai.html" style="color:var(--ml-accent)">Use via Skill / MCP →</a>
          </div>
          <pre class="ml-code-block" data-code></pre>
        </div>
      `;
      card.querySelector("[data-code]").textContent = aiPrompt;

      const drawer = card.querySelector("[data-drawer]");
      const toggleBtn = card.querySelector("[data-toggle-code]");
      toggleBtn.addEventListener("click", () => {
        const hidden = drawer.classList.toggle("is-hidden");
        toggleBtn.setAttribute("aria-expanded", String(!hidden));
      });

      card.querySelector("[data-copy-ai]").addEventListener("click", () => {
        if (window.MotionLabApp) {
          window.MotionLabApp.copyText(aiPrompt, `Copied "${comp.title}" AI spec`);
        }
      });

      grid.appendChild(card);
      mounted.push(window.MotionLabComponentsRuntime.mountComponent(comp.id, card.querySelector("[data-stage]")));
    });
  }

  renderFilters();
  renderGrid();
})();
