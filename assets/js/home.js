/* Motion Lab — Homepage gallery renderer, filter pills, and live search */
(function () {
  "use strict";

  const gallery = document.getElementById("ml-gallery");
  const filterWrap = document.getElementById("ml-filters");
  const searchInput = document.getElementById("ml-search");
  const countBadge = document.getElementById("ml-visible-count");
  if (!gallery || !window.MOTION_STUDIES) return;

  const categories = ["All", "Surfaces", "Navigation", "Feedback", "Micro-Motion"];
  let activeCategory = "All";
  let query = "";
  let mountedInstances = [];

  function unmountAll() {
    mountedInstances.forEach((inst) => {
      if (inst && typeof inst.destroy === "function") inst.destroy();
    });
    mountedInstances = [];
  }

  function renderFilters() {
    filterWrap.innerHTML = categories.map((cat) => {
      const count = cat === "All"
        ? window.MOTION_STUDIES.length
        : window.MOTION_STUDIES.filter((s) => s.category === cat).length;
      return `<button type="button" class="ml-pill" data-cat="${cat}" aria-pressed="${cat === activeCategory}">${cat} (${count})</button>`;
    }).join("");

    filterWrap.querySelectorAll("[data-cat]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeCategory = btn.dataset.cat;
        filterWrap.querySelectorAll("[data-cat]").forEach((b) => {
          b.setAttribute("aria-pressed", String(b.dataset.cat === activeCategory));
        });
        renderGallery();
      });
    });
  }

  function renderGallery() {
    unmountAll();
    const q = query.trim().toLowerCase();
    const list = window.MOTION_STUDIES.filter((s) => {
      const catOk = activeCategory === "All" || s.category === activeCategory;
      const qOk = !q || `${s.title} ${s.tagline} ${s.category} ${s.specLabel}`.toLowerCase().includes(q);
      return catOk && qOk;
    });

    if (countBadge) countBadge.textContent = `${list.length} / ${window.MOTION_STUDIES.length}`;

    if (!list.length) {
      gallery.innerHTML = `
        <div class="ml-prose-card" style="grid-column:1 / -1;text-align:center;padding:36px 20px;">
          <strong>No matching motion studies.</strong>
          <p style="margin:6px 0 0;color:var(--ml-ink-secondary);">Try clearing your filter or searching another keyword.</p>
        </div>
      `;
      return;
    }

    gallery.innerHTML = "";
    list.forEach((study) => {
      const article = document.createElement("article");
      article.className = "ml-card";
      article.dataset.studyId = study.id;
      article.innerHTML = `
        <div class="ml-card-stage" data-stage></div>
        <div class="ml-card-meta">
          <div class="ml-card-top">
            <h2 class="ml-card-title"><a href="./study.html?id=${encodeURIComponent(study.id)}">${study.title}</a></h2>
            <span class="ml-badge">${study.category}</span>
          </div>
          <p class="ml-card-desc">${study.tagline}</p>
          <div class="ml-card-foot">
            <span class="ml-card-spec">${study.specLabel}</span>
            <div class="ml-card-foot-actions">
              <button type="button" class="ml-mini-btn" data-copy-ai>Copy for AI</button>
              <a class="ml-open-link" href="./study.html?id=${encodeURIComponent(study.id)}">
                <span>Workbench</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      `;
      article.querySelector("[data-copy-ai]").addEventListener("click", () => {
        const prompt = [
          `Implement Motion Lab study "${study.title}" (${study.id}).`,
          `Category: ${study.category} | Spec: ${study.specLabel}`,
          `Default Easing: ${study.defaultEasing}`,
          `Triggers: ${study.triggers}`,
          `Design Rationale: ${study.notes}`,
          `Fetch full CSS/JS from: https://17860288878k-debug.github.io/motion-lab/registry.json (or call MCP tool get_motion_spec with id="${study.id}").`,
          `Preserve mid-flight interruption safety and prefers-reduced-motion compliance.`
        ].join("\n");
        if (window.MotionLabApp) {
          window.MotionLabApp.copyText(prompt, `Copied "${study.title}" AI spec`);
        }
      });
      gallery.appendChild(article);
      const inst = window.MotionLabRuntime.mountStudy(study.id, article.querySelector("[data-stage]"));
      mountedInstances.push(inst);
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      query = e.target.value || "";
      renderGallery();
    });
  }

  renderFilters();
  renderGallery();
})();
