/* Motion Lab — Live interactive DOM & animation controllers for all 12 studies */
(function () {
  "use strict";

  function isReducedMotion(el) {
    if (el && el.closest && el.closest(".ml-reduced-motion")) return true;
    return Boolean(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  function mountStudy(id, container, onEvent) {
    const emit = typeof onEvent === "function" ? onEvent : function () {};
    const cleanups = [];
    container.innerHTML = "";
    let rootTarget = null;
    let triggerPrimary = function () {};

    if (id === "adaptive-card") {
      container.innerHTML = `
        <div class="st-resize-card" data-target>
          <div class="st-resize-head"><span>Release Build</span><span class="st-resize-dot"></span></div>
          <div class="st-bar w92"></div>
          <div class="st-bar w60"></div>
          <div class="st-bar w80"></div>
          <div class="st-bar w45"></div>
        </div>
        <button type="button" class="st-trigger" data-action>Toggle Size</button>
      `;
      const card = container.querySelector("[data-target]");
      const btn = container.querySelector("[data-action]");
      rootTarget = card;
      triggerPrimary = () => {
        const compact = card.classList.toggle("is-compact");
        emit(`adaptive-card → ${compact ? "compact (162×138)" : "expanded (232×112)"}`);
      };
      btn.addEventListener("click", triggerPrimary);
    }

    else if (id === "origin-menu") {
      container.innerHTML = `
        <div class="st-menu-anchor">
          <button type="button" class="st-menu-btn" aria-expanded="false" data-menu-btn>
            <span>Actions</span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 6l4 4 4-4"/></svg>
          </button>
          <div class="st-menu-pop" role="menu" data-target>
            <button type="button" class="st-menu-item is-selected" role="menuitem" data-item="Duplicate"><span>Duplicate</span><span>⌘D</span></button>
            <button type="button" class="st-menu-item" role="menuitem" data-item="Inspect Tokens"><span>Inspect Tokens</span><span>⌘I</span></button>
            <button type="button" class="st-menu-item" role="menuitem" data-item="Export Preset"><span>Export Preset</span><span>⌘E</span></button>
          </div>
        </div>
      `;
      const btn = container.querySelector("[data-menu-btn]");
      const pop = container.querySelector("[data-target]");
      rootTarget = pop;
      let open = false;

      function setOpen(next, reason) {
        if (next === open) return;
        open = next;
        btn.setAttribute("aria-expanded", String(open));
        const cs = getComputedStyle(pop);
        const openDur = (pop.style.getPropertyValue("--s-open-dur") || cs.getPropertyValue("--s-open-dur") || "250ms").trim();
        const closeDur = (pop.style.getPropertyValue("--s-close-dur") || cs.getPropertyValue("--s-close-dur") || "150ms").trim();
        const preScale = (pop.style.getPropertyValue("--s-pre-scale") || cs.getPropertyValue("--s-pre-scale") || "0.97").trim();

        if (open) {
          // Ensure every open starts cleanly from tuned --s-pre-scale rather than stale .is-closing state
          pop.classList.remove("is-closing");
          void pop.offsetWidth;
          pop.classList.add("is-open");
          emit(`origin-menu → open (${openDur}, scale ${preScale}→1)`);
        } else {
          pop.classList.remove("is-open");
          pop.classList.add("is-closing");
          emit(`origin-menu → close (${reason ? `${reason}, ` : ""}${closeDur}, scale 1→0.99)`);
        }
      }

      pop.addEventListener("transitionend", (e) => {
        if (!open && e.propertyName === "opacity") {
          pop.classList.remove("is-closing");
        }
      });

      triggerPrimary = () => setOpen(!open);
      btn.addEventListener("click", (e) => { e.stopPropagation(); setOpen(!open); });
      pop.querySelectorAll("[data-item]").forEach((it) => {
        it.addEventListener("click", () => {
          pop.querySelectorAll("[data-item]").forEach((x) => x.classList.remove("is-selected"));
          it.classList.add("is-selected");
          emit(`origin-menu selected "${it.dataset.item}"`);
          setOpen(false, "selected");
        });
      });

      const onDocClick = (e) => {
        if (open && !pop.contains(e.target) && !btn.contains(e.target)) {
          setOpen(false, "outside click");
        }
      };
      const onDocKeydown = (e) => {
        if (open && e.key === "Escape") {
          e.preventDefault();
          setOpen(false, "Escape");
          btn.focus();
        }
      };
      document.addEventListener("click", onDocClick);
      document.addEventListener("keydown", onDocKeydown);
      cleanups.push(() => {
        document.removeEventListener("click", onDocClick);
        document.removeEventListener("keydown", onDocKeydown);
      });
    }

    else if (id === "scale-dialog") {
      container.innerHTML = `
        <div class="st-dialog-wrap">
          <button type="button" class="ml-btn ml-btn-primary" data-open>Open Dialog</button>
          <div class="st-dialog-veil" data-target aria-hidden="true">
            <div class="st-dialog-box" role="dialog" aria-modal="true" aria-label="Publish Snapshot">
              <h3 class="st-dialog-title">Publish Snapshot?</h3>
              <p class="st-dialog-body">Motion tokens will lock to this release preset and remain reversible.</p>
              <div class="st-dialog-actions">
                <button type="button" class="st-chip-btn" data-close>Cancel</button>
                <button type="button" class="st-chip-btn" style="background:var(--ml-ink);color:var(--ml-bg);border-color:var(--ml-ink);" data-confirm>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      `;
      const openBtn = container.querySelector("[data-open]");
      const veil = container.querySelector("[data-target]");
      rootTarget = veil;
      let open = false;

      function setOpen(next, reason) {
        if (next === open) return;
        open = next;
        veil.classList.toggle("is-open", open);
        veil.setAttribute("aria-hidden", String(!open));
        const cs = getComputedStyle(veil);
        const openDur = (veil.style.getPropertyValue("--s-open-dur") || cs.getPropertyValue("--s-open-dur") || "250ms").trim();
        const closeDur = (veil.style.getPropertyValue("--s-close-dur") || cs.getPropertyValue("--s-close-dur") || "150ms").trim();
        const scale = (veil.style.getPropertyValue("--s-scale") || cs.getPropertyValue("--s-scale") || "0.96").trim();
        emit(`scale-dialog → ${open ? `open (${openDur}, ${scale}→1)` : `close (${reason || closeDur})`}`);
      }

      triggerPrimary = () => setOpen(!open, "toggle");
      openBtn.addEventListener("click", () => setOpen(true));
      veil.querySelector("[data-close]").addEventListener("click", () => setOpen(false, "cancel"));
      veil.querySelector("[data-confirm]").addEventListener("click", () => setOpen(false, "confirmed"));
      veil.addEventListener("click", (e) => { if (e.target === veil) setOpen(false, "backdrop"); });

      const onDocKeydown = (e) => {
        if (open && e.key === "Escape") {
          e.preventDefault();
          setOpen(false, "Escape");
          openBtn.focus();
        }
      };
      document.addEventListener("keydown", onDocKeydown);
      cleanups.push(() => document.removeEventListener("keydown", onDocKeydown));
    }

    else if (id === "sliding-tabs") {
      const tabs = ["Overview", "Curves", "Tokens", "Export"];
      container.innerHTML = `
        <div class="st-tabs-box" data-target>
          <div class="st-tabs-bar" role="tablist">
            <div class="st-tabs-pill" data-pill></div>
            ${tabs.map((t, i) => `<button type="button" class="st-tab-btn" role="tab" aria-selected="${i === 0}" data-idx="${i}">${t}</button>`).join("")}
          </div>
          <div class="st-tabs-caption" data-cap>Active panel: Overview</div>
        </div>
      `;
      const box = container.querySelector("[data-target]");
      const pill = container.querySelector("[data-pill]");
      const btns = Array.from(container.querySelectorAll("[role='tab']"));
      const cap = container.querySelector("[data-cap]");
      rootTarget = box;
      let activeIdx = 0;

      function positionPill(idx, instant) {
        const b = btns[idx];
        if (!b) return;
        if (instant) pill.style.transition = "none";
        pill.style.width = `${b.offsetWidth}px`;
        pill.style.transform = `translateX(${b.offsetLeft}px)`;
        if (instant) {
          void pill.offsetWidth;
          pill.style.transition = "";
        }
      }

      function select(idx) {
        activeIdx = idx;
        btns.forEach((b, i) => b.setAttribute("aria-selected", String(i === idx)));
        positionPill(idx, false);
        cap.textContent = `Active panel: ${tabs[idx]}`;
        emit(`sliding-tabs → "${tabs[idx]}" (x=${btns[idx].offsetLeft}px, w=${btns[idx].offsetWidth}px)`);
      }

      btns.forEach((b, i) => b.addEventListener("click", () => select(i)));
      requestAnimationFrame(() => positionPill(0, true));
      if (typeof ResizeObserver !== "undefined") {
        const ro = new ResizeObserver(() => positionPill(activeIdx, true));
        ro.observe(box);
        cleanups.push(() => ro.disconnect());
      }
      triggerPrimary = () => select((activeIdx + 1) % tabs.length);
    }

    else if (id === "accordion-disclosure") {
      container.innerHTML = `
        <div class="st-acc" data-target>
          <div class="st-acc-item">
            <button type="button" class="st-acc-head" aria-expanded="false" data-acc="0">
              <span>Timing Guidelines</span>
              <svg class="st-acc-chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 6l4 4 4-4"/></svg>
            </button>
            <div class="st-acc-panel" data-panel="0">
              <div class="st-acc-inner">
                <div class="st-acc-content">Pair 250ms smooth-out opens with faster 150ms exits to keep UI crisp.</div>
              </div>
            </div>
          </div>
          <div class="st-acc-item">
            <button type="button" class="st-acc-head" aria-expanded="false" data-acc="1">
              <span>Reduced Motion</span>
              <svg class="st-acc-chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 6l4 4 4-4"/></svg>
            </button>
            <div class="st-acc-panel" data-panel="1">
              <div class="st-acc-inner">
                <div class="st-acc-content">All studies honor prefers-reduced-motion without breaking disclosure states.</div>
              </div>
            </div>
          </div>
        </div>
      `;
      const acc = container.querySelector("[data-target]");
      rootTarget = acc;
      const heads = Array.from(acc.querySelectorAll("[data-acc]"));
      const panels = Array.from(acc.querySelectorAll("[data-panel]"));

      function toggle(i) {
        const expanded = heads[i].getAttribute("aria-expanded") === "true";
        heads[i].setAttribute("aria-expanded", String(!expanded));
        panels[i].classList.toggle("is-open", !expanded);
        emit(`accordion[${i}] → ${!expanded ? "expanded (1fr)" : "collapsed (0fr)"}`);
      }
      heads.forEach((h, i) => h.addEventListener("click", () => toggle(i)));
      triggerPrimary = () => toggle(0);
    }

    else if (id === "page-transition") {
      container.innerHTML = `
        <div class="st-pager" data-target>
          <div class="st-page is-active" data-p1>
            <div style="font-size:11.5px;font-weight:700;color:var(--ml-ink-muted);text-transform:uppercase;letter-spacing:.04em;">Workspaces</div>
            <button type="button" class="st-page-row" data-go="Motion Core"><span>Motion Core</span><span>→</span></button>
            <button type="button" class="st-page-row" data-go="Mobile Kit"><span>Mobile Kit</span><span>→</span></button>
          </div>
          <div class="st-page is-right" data-p2>
            <button type="button" class="st-chip-btn" style="align-self:flex-start;" data-back>← Back</button>
            <div style="font-size:15px;font-weight:700;margin-top:4px;" data-detail-title>Motion Core</div>
            <div style="font-size:12px;color:var(--ml-ink-secondary);">Directional translateX + 3px cross-blur preserves spatial context.</div>
          </div>
        </div>
      `;
      const pager = container.querySelector("[data-target]");
      const p1 = pager.querySelector("[data-p1]");
      const p2 = pager.querySelector("[data-p2]");
      const titleEl = pager.querySelector("[data-detail-title]");
      rootTarget = pager;
      let page = 1;

      function goForward(label) {
        if (label) titleEl.textContent = label;
        page = 2;
        p1.className = "st-page is-left";
        p2.className = "st-page is-active";
        emit(`page-transition → forward to "${titleEl.textContent}"`);
      }
      function goBack() {
        page = 1;
        p1.className = "st-page is-active";
        p2.className = "st-page is-right";
        emit("page-transition → back to Workspaces");
      }
      pager.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => goForward(b.dataset.go)));
      pager.querySelector("[data-back]").addEventListener("click", goBack);
      triggerPrimary = () => (page === 1 ? goForward("Motion Core") : goBack());
    }

    else if (id === "toast-stack") {
      const messages = [
        ["Build synced", "Just now"],
        ["Preset saved", "2s ago"],
        ["Curve exported", "8s ago"],
        ["Snapshot tagged", "14s ago"]
      ];
      container.innerHTML = `
        <div class="st-stack-wrap" data-target role="button" tabindex="0" aria-expanded="false" aria-label="Notification stack — hover or tap to expand"></div>
        <button type="button" class="st-trigger" data-push>Push Notice</button>
      `;
      const stack = container.querySelector("[data-target]");
      const pushBtn = container.querySelector("[data-push]");
      rootTarget = stack;
      let counter = 0;

      function toggleExpand() {
        const exp = stack.classList.toggle("is-expanded");
        stack.setAttribute("aria-expanded", String(exp));
        emit(`toast-stack → ${exp ? "expanded (tap toggle)" : "collapsed"}`);
      }
      stack.addEventListener("click", toggleExpand);
      stack.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleExpand();
        }
      });

      function addNotice(animate) {
        const pair = messages[counter % messages.length];
        counter++;
        const el = document.createElement("div");
        el.className = animate ? "st-banner is-entering" : "st-banner";
        el.innerHTML = `<strong>${pair[0]} #${counter}</strong><span style="color:var(--ml-ink-muted);font-size:11.5px;">${pair[1]}</span>`;
        stack.prepend(el);
        const items = Array.from(stack.children);
        items.forEach((child, idx) => {
          if (idx > 2) {
            child.remove();
          } else {
            child.setAttribute("data-depth", String(idx));
          }
        });
        if (animate) {
          void el.offsetWidth;
          el.classList.remove("is-entering");
          emit(`toast-stack → pushed "${pair[0]} #${counter}" (depth 0..2)`);
        }
      }
      addNotice(false);
      addNotice(false);
      triggerPrimary = () => addNotice(true);
      pushBtn.addEventListener("click", triggerPrimary);
    }

    else if (id === "validation-shake") {
      container.innerHTML = `
        <div class="st-shake-form" data-target>
          <input type="text" class="st-shake-input" value="hello@motion" aria-label="Email preview" data-inp />
          <div class="st-shake-msg" role="alert">Please enter a complete email address.</div>
        </div>
        <button type="button" class="st-trigger" data-action>Validate Invalid</button>
      `;
      const form = container.querySelector("[data-target]");
      const inp = form.querySelector("[data-inp]");
      const btn = container.querySelector("[data-action]");
      rootTarget = form;
      let revertTimer = null;

      function triggerError() {
        clearTimeout(revertTimer);
        form.classList.remove("is-shaking");
        void form.offsetWidth;
        form.classList.add("is-error", "is-shaking");
        emit("validation-shake → error shake triggered (auto-reverts in 3s)");
        revertTimer = setTimeout(() => {
          form.classList.remove("is-error", "is-shaking");
          emit("validation-shake → auto-reverted to neutral");
        }, 3000);
      }

      btn.addEventListener("click", triggerError);
      inp.addEventListener("input", () => {
        if (form.classList.contains("is-error")) {
          clearTimeout(revertTimer);
          form.classList.remove("is-error", "is-shaking");
          emit("validation-shake → cleared on input");
        }
      });
      cleanups.push(() => clearTimeout(revertTimer));
      triggerPrimary = triggerError;
    }

    else if (id === "confirm-check") {
      container.innerHTML = `
        <div class="st-check-wrap is-in" data-target>
          <div class="st-check-circle">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
              <path class="st-check-path" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
        </div>
        <button type="button" class="st-trigger" data-action>Replay Check</button>
      `;
      const wrap = container.querySelector("[data-target]");
      const btn = container.querySelector("[data-action]");
      rootTarget = wrap;

      function replay() {
        wrap.classList.remove("is-in");
        void wrap.offsetWidth;
        wrap.classList.add("is-in");
        emit("confirm-check → replayed 5-track check animation");
      }
      btn.addEventListener("click", replay);
      triggerPrimary = replay;
    }

    else if (id === "spring-like") {
      const angles = Array.from({ length: 9 }, (_, i) => (i * 40) * Math.PI / 180);
      const particles = angles.map((a) => {
        const r = 24;
        const px = (Math.cos(a) * r).toFixed(1) + "px";
        const py = (Math.sin(a) * r).toFixed(1) + "px";
        return `<span class="st-particle" style="--px:${px};--py:${py}"></span>`;
      }).join("");

      container.innerHTML = `
        <button type="button" class="st-like-btn" aria-pressed="false" data-target>
          ${particles}
          <svg class="st-like-heart" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span data-count>42</span>
        </button>
      `;
      const btn = container.querySelector("[data-target]");
      const countEl = btn.querySelector("[data-count]");
      rootTarget = btn;
      let liked = false;
      let count = 42;
      let burstTimer = null;

      function toggleLike() {
        liked = !liked;
        count += liked ? 1 : -1;
        btn.setAttribute("aria-pressed", String(liked));
        countEl.textContent = String(count);
        clearTimeout(burstTimer);
        btn.classList.remove("is-bursting");
        if (liked && !isReducedMotion(container)) {
          void btn.offsetWidth;
          btn.classList.add("is-bursting");
          burstTimer = setTimeout(() => btn.classList.remove("is-bursting"), 650);
          emit(`spring-like → liked (${count}) + 9-particle burst`);
        } else {
          emit(`spring-like → ${liked ? `liked (${count}, reduced-motion)` : `unliked (${count})`}`);
        }
      }
      btn.addEventListener("click", toggleLike);
      cleanups.push(() => clearTimeout(burstTimer));
      triggerPrimary = toggleLike;
    }

    else if (id === "drum-counter") {
      container.innerHTML = `
        <div class="st-counter-readout" data-target aria-live="polite">1,248</div>
        <div class="st-inline-controls">
          <button type="button" class="st-chip-btn" data-delta="-24">-24</button>
          <button type="button" class="st-chip-btn" data-delta="12">+12</button>
          <button type="button" class="st-chip-btn" data-delta="135">+135</button>
        </div>
      `;
      const readout = container.querySelector("[data-target]");
      rootTarget = readout;
      let value = 1248;

      function update(delta) {
        const nextValue = Math.max(0, value + delta);
        if (nextValue === value) {
          emit("drum-counter → already at floor (0)");
          return;
        }
        const prev = value.toLocaleString("en-US");
        value = nextValue;
        const next = value.toLocaleString("en-US");
        const dir = delta >= 0 ? 1 : -1;
        readout.style.setProperty("--dir", String(dir));
        const sameLen = prev.length === next.length;
        readout.innerHTML = "";
        let staggerIdx = 0;
        for (let i = 0; i < next.length; i++) {
          const ch = next[i];
          if (sameLen && prev[i] === ch) {
            readout.append(document.createTextNode(ch));
          } else {
            const slot = document.createElement("span");
            slot.className = "st-digit-slot";
            if (sameLen) {
              const oldEl = document.createElement("span");
              oldEl.className = "st-digit-old";
              oldEl.setAttribute("aria-hidden", "true");
              oldEl.textContent = prev[i];
              slot.appendChild(oldEl);
            }
            const newEl = document.createElement("span");
            newEl.className = "st-digit-new";
            newEl.style.setProperty("--stagger-d", `calc(var(--s-stagger) * ${staggerIdx})`);
            newEl.textContent = ch;
            slot.appendChild(newEl);
            readout.appendChild(slot);
            staggerIdx++;
          }
        }
        emit(`drum-counter → ${prev} → ${next} (${staggerIdx} digits animated)`);
      }

      container.querySelectorAll("[data-delta]").forEach((b) => {
        b.addEventListener("click", () => update(Number(b.dataset.delta)));
      });
      triggerPrimary = () => update(135);
    }

    else if (id === "hover-cluster") {
      const colors = ["#2257F2", "#0D9468", "#D97706", "#E11D48", "#7C3AED"];
      const initials = ["KL", "MR", "AN", "JT", "SY"];
      container.innerHTML = `
        <div class="st-cluster-wrap" data-target>
          <div class="st-avatar-row" data-avatars>
            ${initials.map((t, i) => `<div class="st-avatar" tabindex="0" role="button" aria-label="Avatar ${t}" style="background:${colors[i]}" data-av="${i}">${t}</div>`).join("")}
          </div>
          <div class="st-tilt-card" data-tilt>
            <div class="st-tilt-glare"></div>
            <div style="display:flex;justify-content:space-between;font-size:11px;opacity:.75;font-family:var(--ml-font-mono);">
              <span>STUDIO PASS</span><span>3D TILT</span>
            </div>
            <div style="font-size:15px;font-weight:700;letter-spacing:-0.01em;">Move pointer to tilt</div>
          </div>
        </div>
      `;
      const wrap = container.querySelector("[data-target]");
      const row = wrap.querySelector("[data-avatars]");
      const avs = Array.from(row.querySelectorAll("[data-av]"));
      const tilt = wrap.querySelector("[data-tilt]");
      rootTarget = wrap;
      let waveTimer = null;

      function resetRest() {
        avs.forEach((el) => {
          el.style.setProperty("--shift", "0px");
          el.style.setProperty("--scale", "1");
        });
        tilt.classList.remove("is-tilting");
        tilt.style.setProperty("--rx", "0deg");
        tilt.style.setProperty("--ry", "0deg");
        tilt.style.setProperty("--go", "0");
      }

      function setWave(activeIdx, isLeave) {
        if (isReducedMotion(container)) {
          resetRest();
          return;
        }
        const liftVal = parseFloat(getComputedStyle(wrap).getPropertyValue("--s-lift")) || -6;
        const ease = isLeave ? "var(--s-ease-out)" : "var(--s-ease-in)";
        avs.forEach((el, i) => {
          el.style.setProperty("--avatar-ease", ease);
          if (activeIdx === null) {
            el.style.setProperty("--shift", "0px");
            el.style.setProperty("--scale", "1");
            return;
          }
          const d = Math.abs(i - activeIdx);
          const shift = (liftVal * Math.pow(0.45, d)).toFixed(2) + "px";
          el.style.setProperty("--shift", shift);
          el.style.setProperty("--scale", i === activeIdx ? "1.08" : "1");
        });
      }

      avs.forEach((el, i) => {
        el.addEventListener("mouseenter", () => {
          setWave(i, false);
          emit(`avatar-wave → hover index ${i} (${initials[i]})`);
        });
        el.addEventListener("focus", () => setWave(i, false));
        el.addEventListener("blur", () => setWave(null, true));
        el.addEventListener("click", () => {
          clearTimeout(waveTimer);
          setWave(i, false);
          waveTimer = setTimeout(() => setWave(null, true), 450);
          emit(`avatar-wave → tap index ${i} (${initials[i]})`);
        });
      });
      row.addEventListener("mouseleave", () => {
        setWave(null, true);
        emit("avatar-wave → bouncy spring return");
      });

      tilt.addEventListener("pointermove", (e) => {
        if (isReducedMotion(container)) {
          resetRest();
          return;
        }
        const r = tilt.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const ry = ((px - 0.5) * 24).toFixed(2) + "deg";
        const rx = ((0.5 - py) * 18).toFixed(2) + "deg";
        tilt.classList.add("is-tilting");
        tilt.style.setProperty("--rx", rx);
        tilt.style.setProperty("--ry", ry);
        tilt.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
        tilt.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
        tilt.style.setProperty("--go", "1");
      });
      tilt.addEventListener("pointerleave", () => {
        tilt.classList.remove("is-tilting");
        tilt.style.setProperty("--rx", "0deg");
        tilt.style.setProperty("--ry", "0deg");
        tilt.style.setProperty("--go", "0");
        emit("3d-tilt → smooth return to rest");
      });

      cleanups.push(() => clearTimeout(waveTimer));
      triggerPrimary = () => {
        clearTimeout(waveTimer);
        if (isReducedMotion(container)) {
          resetRest();
          emit("hover-cluster → suppressed under Reduced Motion");
          return;
        }
        setWave(2, false);
        waveTimer = setTimeout(() => setWave(null, true), 450);
      };
    }

    return {
      target: rootTarget,
      trigger: triggerPrimary,
      applyVar(name, val) {
        if (rootTarget) {
          rootTarget.style.setProperty(name, val);
          const nested = rootTarget.querySelector(".st-tilt-card");
          if (nested) nested.style.setProperty(name, val);
        }
      },
      destroy() {
        cleanups.forEach((fn) => {
          try { fn(); } catch (_) {}
        });
      }
    };
  }

  window.MotionLabRuntime = { mountStudy };
})();
