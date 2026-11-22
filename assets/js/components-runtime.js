/* Motion Lab v2.0 — Live Manual Interactive Controllers for 8 Original UI Components */
(function () {
  "use strict";

  let uidSeq = 0;

  function mountComponent(id, container) {
    const cleanups = [];
    const uid = ++uidSeq;
    container.innerHTML = "";

    if (id === "pulse-climate") {
      const gradId = `mlPulseGrad_${uid}`;
      const ticks = Array.from({ length: 36 }, (_, i) => {
        const deg = -135 + (i / 35) * 270;
        return `<line x1="110" y1="12" x2="110" y2="${i % 5 === 0 ? 21 : 17}" stroke="rgba(17,17,20,0.16)" stroke-width="${i % 5 === 0 ? 1.8 : 1.1}" stroke-linecap="round" transform="rotate(${deg} 110 110)"/>`;
      }).join("");

      container.innerHTML = `
        <div class="uiw uiw-pulse">
          <div class="uiw-pulse-glow" data-glow></div>
          <div class="uiw-head">
            <div>
              <div class="uiw-h-title">Living Studio</div>
              <div class="uiw-h-sub">Radiant climate · Auto fan</div>
            </div>
            <div class="uiw-stat-pill"><span style="width:7px;height:7px;border-radius:50%;background:#10b981"></span><span class="uiw-tnum">42% RH</span></div>
          </div>
          <div class="uiw-dial-wrap">
            <svg viewBox="0 0 220 220" width="212" height="212" aria-hidden="true">
              <defs>
                <linearGradient id="${gradId}" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#38bdf8"/>
                  <stop offset="50%" stop-color="#f59e0b"/>
                  <stop offset="100%" stop-color="#ef4444"/>
                </linearGradient>
              </defs>
              ${ticks}
              <circle cx="110" cy="110" r="80" fill="none" stroke="#eeeef2" stroke-width="11" stroke-dasharray="377 503" stroke-linecap="round" transform="rotate(135 110 110)"/>
              <circle data-arc cx="110" cy="110" r="80" fill="none" stroke="url(#${gradId})" stroke-width="11" stroke-dasharray="190 503" stroke-linecap="round" transform="rotate(135 110 110)" style="transition:stroke-dasharray 280ms var(--ease-smooth-out)"/>
              <g data-knob style="transition:transform 280ms var(--ease-bounce);transform-origin:110px 110px">
                <circle cx="110" cy="30" r="8.5" fill="#ffffff" stroke="#111114" stroke-width="2.5"/>
              </g>
            </svg>
            <div class="uiw-dial-center">
              <div class="uiw-temp-val uiw-tnum" data-temp>22.0°</div>
              <div class="uiw-dial-lbl" data-lbl>Balanced comfort</div>
              <div class="uiw-steppers">
                <button type="button" class="uiw-circle-btn" data-minus aria-label="Decrease temperature">−</button>
                <button type="button" class="uiw-circle-btn" data-plus aria-label="Increase temperature">+</button>
              </div>
            </div>
          </div>
          <div class="uiw-seg" role="tablist" aria-label="Climate mood">
            <div class="uiw-seg-thumb" data-thumb></div>
            <button type="button" class="uiw-seg-btn" role="tab" aria-selected="false" data-m="0">Eco</button>
            <button type="button" class="uiw-seg-btn" role="tab" aria-selected="true" data-m="1">Comfort</button>
            <button type="button" class="uiw-seg-btn" role="tab" aria-selected="false" data-m="2">Warm Glow</button>
          </div>
        </div>
      `;

      let temp = 22.0;
      let mood = 1;
      const arc = container.querySelector("[data-arc]");
      const knob = container.querySelector("[data-knob]");
      const tempEl = container.querySelector("[data-temp]");
      const lbl = container.querySelector("[data-lbl]");
      const glow = container.querySelector("[data-glow]");
      const thumb = container.querySelector("[data-thumb]");
      const moodBtns = Array.from(container.querySelectorAll("[data-m]"));

      function sync() {
        const frac = Math.max(0, Math.min(1, (temp - 16) / 12));
        tempEl.textContent = `${temp.toFixed(1)}°`;
        arc.setAttribute("stroke-dasharray", `${(frac * 377).toFixed(1)} 503`);
        knob.style.transform = `rotate(${(-135 + frac * 270).toFixed(1)}deg)`;
        thumb.style.transform = `translateX(${mood * 100}%)`;
        moodBtns.forEach((b, i) => b.setAttribute("aria-selected", String(i === mood)));
        if (mood === 2) {
          glow.style.background = "radial-gradient(circle, #f97316, #fbbf24 55%, transparent 75%)";
          lbl.textContent = "Warm Glow active";
        } else if (mood === 0) {
          glow.style.background = "radial-gradient(circle, #34d399, #38bdf8 55%, transparent 75%)";
          lbl.textContent = "Eco saver mode";
        } else {
          glow.style.background = "radial-gradient(circle, #38bdf8, #818cf8 55%, transparent 75%)";
          lbl.textContent = temp >= 23 ? "Warming studio…" : "Balanced comfort";
        }
      }

      container.querySelector("[data-minus]").addEventListener("click", () => {
        temp = Math.max(16, Math.round((temp - 0.5) * 10) / 10);
        sync();
      });
      container.querySelector("[data-plus]").addEventListener("click", () => {
        temp = Math.min(28, Math.round((temp + 0.5) * 10) / 10);
        sync();
      });
      moodBtns.forEach((b) => {
        b.addEventListener("click", () => {
          mood = Number(b.dataset.m);
          if (mood === 0) temp = 19.5;
          if (mood === 1) temp = 22.0;
          if (mood === 2) temp = 24.5;
          sync();
        });
      });
      sync();
    }

    else if (id === "orbit-flight") {
      container.innerHTML = `
        <div class="uiw is-cobalt uiw-orbit">
          <div class="uiw-head">
            <div class="uiw-mono" style="font-size:11.5px;opacity:.78;font-weight:600">JL 002 · BOEING 787-9</div>
            <div class="uiw-orbit-badge" data-badge>On Time · 38,000 ft</div>
          </div>
          <div class="uiw-iata-row">
            <div><div class="uiw-iata">HND</div><div class="uiw-h-sub">Tokyo Haneda</div></div>
            <div style="text-align:right"><div class="uiw-iata">SFO</div><div class="uiw-h-sub">San Francisco</div></div>
          </div>
          <svg viewBox="0 0 360 88" width="100%" height="88" aria-hidden="true">
            <path d="M 14 70 Q 180 -6 346 70" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="2" stroke-dasharray="5 5"/>
            <path data-path d="M 14 70 Q 180 -6 346 70" fill="none" stroke="#93c5fd" stroke-width="2.8" stroke-linecap="round" stroke-dasharray="210 380" style="transition:stroke-dasharray 380ms var(--ease-smooth-out)"/>
            <circle cx="14" cy="70" r="4" fill="#ffffff"/>
            <circle cx="346" cy="70" r="4" fill="rgba(255,255,255,0.45)"/>
            <g data-plane style="transition:transform 380ms var(--ease-smooth-out)">
              <circle cx="0" cy="0" r="11" fill="rgba(147,197,253,0.28)"/>
              <circle cx="0" cy="0" r="4.5" fill="#ffffff"/>
            </g>
          </svg>
          <div class="uiw-orbit-meta">
            <div><div class="uiw-orbit-k">Progress</div><div class="uiw-orbit-v uiw-tnum" data-v1>58%</div></div>
            <div><div class="uiw-orbit-k">Gate</div><div class="uiw-orbit-v uiw-mono" data-v2>B14</div></div>
            <div><div class="uiw-orbit-k">Seat</div><div class="uiw-orbit-v uiw-mono" data-v3>14A</div></div>
          </div>
          <div class="uiw-seg" role="tablist" aria-label="Flight view">
            <div class="uiw-seg-thumb" data-thumb></div>
            <button type="button" class="uiw-seg-btn" role="tab" aria-selected="true" data-t="0">Live Route</button>
            <button type="button" class="uiw-seg-btn" role="tab" aria-selected="false" data-t="1">Gate B14</button>
            <button type="button" class="uiw-seg-btn" role="tab" aria-selected="false" data-t="2">Boarding</button>
          </div>
        </div>
      `;

      const states = [
        { pt: 0.58, badge: "On Time · 38,000 ft", boarding: false, v1: "58%", v2: "B14", v3: "14A" },
        { pt: 0.72, badge: "Terminal 3 · 4m walk", boarding: false, v1: "72%", v2: "B14 · T3", v3: "14A" },
        { pt: 0.84, badge: "● Boarding · Group 1", boarding: true, v1: "84%", v2: "B14 · T3", v3: "14A · G1" }
      ];
      const badge = container.querySelector("[data-badge]");
      const pathEl = container.querySelector("[data-path]");
      const planeEl = container.querySelector("[data-plane]");
      const thumb = container.querySelector("[data-thumb]");
      const tabs = Array.from(container.querySelectorAll("[data-t]"));

      function setTab(i) {
        const s = states[i];
        tabs.forEach((b, idx) => b.setAttribute("aria-selected", String(idx === i)));
        thumb.style.transform = `translateX(${i * 100}%)`;
        badge.textContent = s.badge;
        badge.classList.toggle("is-boarding", s.boarding);
        container.querySelector("[data-v1]").textContent = s.v1;
        container.querySelector("[data-v2]").textContent = s.v2;
        container.querySelector("[data-v3]").textContent = s.v3;

        const pt = s.pt;
        const bx = (1 - pt) * (1 - pt) * 14 + 2 * (1 - pt) * pt * 180 + pt * pt * 346;
        const by = (1 - pt) * (1 - pt) * 70 + 2 * (1 - pt) * pt * (-6) + pt * pt * 70;
        planeEl.style.transform = `translate(${bx.toFixed(1)}px, ${by.toFixed(1)}px)`;
        pathEl.setAttribute("stroke-dasharray", `${(pt * 356).toFixed(1)} 380`);
      }

      tabs.forEach((b) => b.addEventListener("click", () => setTab(Number(b.dataset.t))));
      setTab(0);
    }

    else if (id === "tempo-audio") {
      container.innerHTML = `
        <div class="uiw is-dark uiw-tempo">
          <div class="uiw-tempo-glow" data-glow></div>
          <div class="uiw-head">
            <div style="display:flex;align-items:center;gap:12px">
              <div class="uiw-vinyl" data-vinyl></div>
              <div>
                <div class="uiw-h-title">Midnight Tape</div>
                <div class="uiw-h-sub" data-sub>Analog Sessions · 96kHz FLAC</div>
              </div>
            </div>
            <button type="button" class="uiw-play-btn" data-play aria-label="Play or pause track">
              <span data-play-ico>▶</span>
            </button>
          </div>
          <div class="uiw-eq-stage">
            ${Array.from({ length: 18 }, (_, i) => `<div class="uiw-eq-bar" data-bar="${i}" style="height:22%"></div>`).join("")}
          </div>
          <div class="uiw-seg" role="tablist" aria-label="Sound preset">
            <div class="uiw-seg-thumb" data-thumb></div>
            <button type="button" class="uiw-seg-btn" role="tab" aria-selected="true" data-p="0">Studio</button>
            <button type="button" class="uiw-seg-btn" role="tab" aria-selected="false" data-p="1">Warm</button>
            <button type="button" class="uiw-seg-btn" role="tab" aria-selected="false" data-p="2">Spatial</button>
          </div>
        </div>
      `;

      let playing = true;
      let preset = 0;
      let phase = 0;
      const bars = Array.from(container.querySelectorAll("[data-bar]"));
      const glow = container.querySelector("[data-glow]");
      const sub = container.querySelector("[data-sub]");
      const thumb = container.querySelector("[data-thumb]");
      const playIco = container.querySelector("[data-play-ico]");
      const vinyl = container.querySelector("[data-vinyl]");
      const presetBtns = Array.from(container.querySelectorAll("[data-p]"));
      const presets = [
        { sub: "Analog Sessions · 96kHz FLAC", glow: "radial-gradient(circle,#a78bfa,#6366f1 60%,transparent)", grad: "linear-gradient(180deg,#c4b5fd,#818cf8 65%,rgba(129,140,248,0.22))" },
        { sub: "Warm Tube EQ · +4dB Low", glow: "radial-gradient(circle,#f59e0b,#ec4899 60%,transparent)", grad: "linear-gradient(180deg,#fcd34d,#f97316 65%,rgba(249,115,22,0.22))" },
        { sub: "Spatial Atmos · 360° Stage", glow: "radial-gradient(circle,#38bdf8,#a78bfa 60%,transparent)", grad: "linear-gradient(180deg,#67e8f9,#818cf8 65%,rgba(129,140,248,0.22))" }
      ];

      function renderEq() {
        const cfg = presets[preset];
        glow.style.background = cfg.glow;
        sub.textContent = cfg.sub;
        thumb.style.transform = `translateX(${preset * 100}%)`;
        playIco.textContent = playing ? "❚❚" : "▶";
        presetBtns.forEach((b, i) => b.setAttribute("aria-selected", String(i === preset)));
        bars.forEach((bar, i) => {
          const norm = i / (bars.length - 1);
          const bias = 1 - Math.abs(norm - 0.5) * (preset === 2 ? 0.5 : 1.1);
          const warm = preset === 1 ? (1 - norm) * 0.34 : 0;
          const wave = 0.5 + 0.34 * Math.sin(phase + i * 0.6) + 0.16 * Math.cos(phase * 0.7 - i);
          const h = playing ? 16 + Math.min(1, Math.max(0.12, wave * bias + warm)) * 78 : 14 + (i % 3) * 5;
          bar.style.height = `${h.toFixed(1)}%`;
          bar.style.background = cfg.grad;
        });
        vinyl.style.transform = `rotate(${(phase * 28).toFixed(1)}deg)`;
      }

      const timer = setInterval(() => {
        if (playing && !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
          phase += 0.32;
          renderEq();
        }
      }, 130);
      cleanups.push(() => clearInterval(timer));

      container.querySelector("[data-play]").addEventListener("click", () => {
        playing = !playing;
        renderEq();
      });
      presetBtns.forEach((b) => {
        b.addEventListener("click", () => {
          preset = Number(b.dataset.p);
          renderEq();
        });
      });
      renderEq();
    }

    else if (id === "chroma-mesh") {
      const themes = [
        { name: "Solstice Mesh", oklch: "oklch(0.71 0.19 352)", hex: "#FB7185", css: "background: radial-gradient(circle at 22% 30%, #fb7185 0%, transparent 56%), radial-gradient(circle at 78% 25%, #a78bfa 0%, transparent 58%), radial-gradient(circle at 60% 85%, #fbbf24 0%, transparent 62%), #4c1d95;" },
        { name: "Cobalt Mesh", oklch: "oklch(0.66 0.20 256)", hex: "#38BDF8", css: "background: radial-gradient(circle at 25% 25%, #38bdf8 0%, transparent 56%), radial-gradient(circle at 80% 35%, #6366f1 0%, transparent 58%), radial-gradient(circle at 50% 85%, #2dd4bf 0%, transparent 62%), #0f172a;" },
        { name: "Matcha Mesh", oklch: "oklch(0.79 0.17 154)", hex: "#34D399", css: "background: radial-gradient(circle at 22% 28%, #86efac 0%, transparent 58%), radial-gradient(circle at 78% 30%, #facc15 0%, transparent 56%), radial-gradient(circle at 52% 88%, #10b981 0%, transparent 62%), #064e3b;" }
      ];

      container.innerHTML = `
        <div class="uiw uiw-chroma">
          <div class="uiw-head">
            <div class="uiw-h-title">Palette Studio</div>
            <button type="button" class="ml-mini-btn" data-copy-css>Copy CSS</button>
          </div>
          <div class="uiw-mesh-box">
            ${themes.map((t, i) => `<div class="uiw-mesh-layer" data-layer="${i}" style="${t.css};opacity:${i === 0 ? 1 : 0}"></div>`).join("")}
            <div class="uiw-mesh-badge" data-name>Solstice Mesh</div>
          </div>
          <div class="uiw-swatch-row">
            <button type="button" class="uiw-swatch-btn" aria-pressed="true" data-sw="0"><span class="uiw-swatch-dot" style="background:linear-gradient(135deg,#fb7185,#a78bfa)"></span>Solstice</button>
            <button type="button" class="uiw-swatch-btn" aria-pressed="false" data-sw="1"><span class="uiw-swatch-dot" style="background:linear-gradient(135deg,#38bdf8,#6366f1)"></span>Cobalt</button>
            <button type="button" class="uiw-swatch-btn" aria-pressed="false" data-sw="2"><span class="uiw-swatch-dot" style="background:linear-gradient(135deg,#34d399,#facc15)"></span>Matcha</button>
          </div>
          <div class="uiw-token-strip uiw-mono">
            <span data-oklch>oklch(0.71 0.19 352)</span>
            <span data-hex>#FB7185</span>
          </div>
        </div>
      `;

      let active = 0;
      const layers = Array.from(container.querySelectorAll("[data-layer]"));
      const swBtns = Array.from(container.querySelectorAll("[data-sw]"));
      const copyBtn = container.querySelector("[data-copy-css]");

      function pick(i) {
        active = i;
        layers.forEach((l, idx) => { l.style.opacity = idx === i ? "1" : "0"; });
        swBtns.forEach((b, idx) => b.setAttribute("aria-pressed", String(idx === i)));
        container.querySelector("[data-name]").textContent = themes[i].name;
        container.querySelector("[data-oklch]").textContent = themes[i].oklch;
        container.querySelector("[data-hex]").textContent = themes[i].hex;
      }

      swBtns.forEach((b) => b.addEventListener("click", () => pick(Number(b.dataset.sw))));
      copyBtn.addEventListener("click", () => {
        if (window.MotionLabApp) window.MotionLabApp.copyText(themes[active].css, `Copied ${themes[active].name} CSS`);
        copyBtn.textContent = "✓ Copied";
        setTimeout(() => { copyBtn.textContent = "Copy CSS"; }, 1400);
      });
    }

    else if (id === "focus-timer") {
      container.innerHTML = `
        <div class="uiw is-warm uiw-focus">
          <div class="uiw-head">
            <div class="uiw-h-title">Deep Work</div>
            <div class="uiw-stat-pill" data-st style="background:#efe9df;color:#78716c">● Ready · 25m</div>
          </div>
          <div class="uiw-focus-ring">
            <svg viewBox="0 0 180 180" width="166" height="166" aria-hidden="true">
              <circle cx="90" cy="90" r="74" fill="none" stroke="#e9e2d6" stroke-width="9"/>
              <circle data-ring cx="90" cy="90" r="74" fill="none" stroke="#dc5c3b" stroke-width="9" stroke-linecap="round" stroke-dasharray="465" stroke-dashoffset="465" transform="rotate(-90 90 90)" style="transition:stroke-dashoffset 320ms var(--ease-smooth-out)"/>
            </svg>
            <div class="uiw-focus-center">
              <div class="uiw-focus-digits uiw-mono" data-time>25:00</div>
              <div class="uiw-h-sub" data-sub>Sprint block #2</div>
            </div>
          </div>
          <button type="button" class="uiw-focus-btn" data-toggle>Start Focus</button>
          <div class="uiw-sound-row">
            <button type="button" class="uiw-sound-btn" aria-pressed="false" data-sound="Rain">Rain</button>
            <button type="button" class="uiw-sound-btn" aria-pressed="false" data-sound="Vinyl">Vinyl</button>
            <button type="button" class="uiw-sound-btn" aria-pressed="false" data-sound="Forest">Forest</button>
          </div>
        </div>
      `;

      let running = false;
      let remaining = 1500;
      let activeSound = "";
      const ring = container.querySelector("[data-ring]");
      const timeEl = container.querySelector("[data-time]");
      const stEl = container.querySelector("[data-st]");
      const subEl = container.querySelector("[data-sub]");
      const toggleBtn = container.querySelector("[data-toggle]");
      const soundBtns = Array.from(container.querySelectorAll("[data-sound]"));

      function sync() {
        const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
        const ss = String(remaining % 60).padStart(2, "0");
        timeEl.textContent = `${mm}:${ss}`;
        const pct = running ? Math.max(0.08, (1500 - remaining) / 60) : (1500 - remaining) / 60;
        ring.setAttribute("stroke-dashoffset", String((465 * (1 - Math.min(1, pct))).toFixed(1)));
        toggleBtn.textContent = running ? "Pause Session" : "Start Focus";
        toggleBtn.classList.toggle("is-running", running);
        stEl.textContent = running ? "● In Flow" : "● Ready · 25m";
        stEl.style.background = running ? "#fdece7" : "#efe9df";
        stEl.style.color = running ? "#c2410c" : "#78716c";
        subEl.textContent = activeSound ? `${activeSound} ambience · active` : (running ? "Notifications muted" : "Sprint block #2");
      }

      const timer = setInterval(() => {
        if (running && remaining > 0) {
          remaining--;
          sync();
        }
      }, 1000);
      cleanups.push(() => clearInterval(timer));

      toggleBtn.addEventListener("click", () => {
        running = !running;
        sync();
      });
      soundBtns.forEach((b) => {
        b.addEventListener("click", () => {
          const name = b.dataset.sound;
          activeSound = activeSound === name ? "" : name;
          soundBtns.forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.sound === activeSound)));
          sync();
        });
      });
      sync();
    }

    else if (id === "forge-deploy") {
      const steps = [
        ["Typecheck & Lint", "0.4s"],
        ["Bundle · 38.4 KB gzip", "1.1s"],
        ["Edge CDN · 32 regions", "0.8s"],
        ["Production Live", "14ms"]
      ];
      container.innerHTML = `
        <div class="uiw is-dark uiw-forge">
          <div class="uiw-head">
            <div>
              <div class="uiw-h-title">motion-lab</div>
              <div class="uiw-h-sub uiw-mono">main · 4a9e2f · v2.0</div>
            </div>
            <div class="uiw-stat-pill uiw-mono" data-pill style="background:rgba(148,163,184,0.16);color:#cbd5e1">Ready</div>
          </div>
          <div class="uiw-forge-steps">
            ${steps.map((s, i) => `
              <div class="uiw-forge-row" data-row="${i}">
                <span style="display:inline-flex;align-items:center;gap:9px"><span class="uiw-forge-ico" data-ico="${i}">○</span><span>${s[0]}</span></span>
                <span class="uiw-mono" style="font-size:11px;color:#64748b" data-tm="${i}">${s[1]}</span>
              </div>`).join("")}
          </div>
          <button type="button" class="uiw-forge-cta" data-deploy>Deploy Release</button>
        </div>
      `;

      const rows = Array.from(container.querySelectorAll("[data-row]"));
      const icos = Array.from(container.querySelectorAll("[data-ico]"));
      const tms = Array.from(container.querySelectorAll("[data-tm]"));
      const pill = container.querySelector("[data-pill]");
      const btn = container.querySelector("[data-deploy]");
      let timers = [];
      let state = "idle"; // idle | building | live

      function clearTimers() {
        timers.forEach(clearTimeout);
        timers = [];
      }
      cleanups.push(clearTimers);

      function resetRows() {
        rows.forEach((r, i) => {
          r.className = "uiw-forge-row";
          icos[i].textContent = "○";
          tms[i].style.color = "#64748b";
        });
      }

      btn.addEventListener("click", () => {
        clearTimers();
        resetRows();
        state = "building";
        btn.className = "uiw-forge-cta is-building";
        btn.textContent = "Deploying release…";
        pill.textContent = "● Building…";
        pill.style.background = "rgba(183,164,255,0.2)";
        pill.style.color = "#c4b5fd";

        steps.forEach((_, idx) => {
          timers.push(setTimeout(() => {
            rows[idx].classList.add("is-active");
            icos[idx].textContent = "◌";
          }, idx * 420));
          timers.push(setTimeout(() => {
            rows[idx].classList.remove("is-active");
            rows[idx].classList.add("is-done");
            icos[idx].textContent = "✓";
            tms[idx].style.color = "#34d399";
            if (idx === steps.length - 1) {
              state = "live";
              btn.className = "uiw-forge-cta is-live";
              btn.textContent = "✓ Deployed to Edge (Redeploy)";
              pill.textContent = "● Live · 14ms";
              pill.style.background = "rgba(52,211,153,0.18)";
              pill.style.color = "#34d399";
            }
          }, idx * 420 + 360));
        });
      });
    }

    else if (id === "shelf-books") {
      const books = [
        { kicker: "EDITION 01", name: "Grid<br/>Systems", author: "Swiss Layout Archive", title: "Grid Systems", pct: 48, bg: "linear-gradient(155deg,#1d4ed8,#1e3a8a)", fg: "#eff6ff", bar: "#93c5fd" },
        { kicker: "EDITION 02", name: "Kinetic<br/>Craft", author: "Interactive Motion", title: "Kinetic Craft", pct: 76, bg: "linear-gradient(155deg,#ea580c,#9a3412)", fg: "#fff7ed", bar: "#fed7aa" },
        { kicker: "EDITION 03", name: "Spatial<br/>Type", author: "Variable Systems", title: "Spatial Type", pct: 90, bg: "linear-gradient(155deg,#0f172a,#1e293b)", fg: "#f8fafc", bar: "#34d399" }
      ];
      container.innerHTML = `
        <div class="uiw uiw-shelf">
          <div class="uiw-head">
            <div><div class="uiw-h-title">Design Shelf</div><div class="uiw-h-sub">3 editions · Click arrows or covers</div></div>
            <button type="button" class="ml-mini-btn" data-bm aria-pressed="false" aria-label="Bookmark edition">☆ Save</button>
          </div>
          <div class="uiw-shelf-deck">
            <button type="button" class="uiw-shelf-arrow is-left" data-prev aria-label="Previous edition">‹</button>
            ${books.map((b, i) => `
              <div class="uiw-book" data-bk="${i}" style="background:${b.bg};color:${b.fg};cursor:pointer">
                <div style="font-size:9px;font-weight:700;letter-spacing:.12em;opacity:.78">${b.kicker}</div>
                <div>
                  <div style="font-size:17px;font-weight:800;letter-spacing:-0.03em;line-height:1.08">${b.name}</div>
                  <div style="width:30px;height:3px;border-radius:2px;background:${b.bar};margin-top:9px"></div>
                </div>
                <div style="font-size:10px;opacity:.82">${b.author}</div>
              </div>`).join("")}
            <button type="button" class="uiw-shelf-arrow is-right" data-next aria-label="Next edition">›</button>
          </div>
          <div class="uiw-shelf-bar">
            <div style="display:flex;justify-content:space-between;font-size:12.5px;font-weight:600">
              <span data-title>Kinetic Craft</span><span class="uiw-mono" data-pct>76%</span>
            </div>
            <div class="uiw-prog-track"><div class="uiw-prog-fill" data-fill style="width:76%"></div></div>
          </div>
        </div>
      `;

      let idx = 1;
      let saved = false;
      const bkEls = Array.from(container.querySelectorAll("[data-bk]"));
      const bmBtn = container.querySelector("[data-bm]");

      function sync() {
        bkEls.forEach((el, i) => {
          const rel = i - idx;
          el.style.zIndex = String(10 - Math.abs(rel) * 3);
          el.style.opacity = String(1 - Math.abs(rel) * 0.24);
          el.style.transform = `translateX(${rel * 92}px) translateY(${Math.abs(rel) * 8}px) scale(${1 - Math.abs(rel) * 0.16}) rotate(${-rel * 8}deg)`;
        });
        container.querySelector("[data-title]").textContent = books[idx].title;
        container.querySelector("[data-pct]").textContent = `${books[idx].pct}%`;
        container.querySelector("[data-fill]").style.width = `${books[idx].pct}%`;
      }

      container.querySelector("[data-prev]").addEventListener("click", () => { idx = (idx + books.length - 1) % books.length; sync(); });
      container.querySelector("[data-next]").addEventListener("click", () => { idx = (idx + 1) % books.length; sync(); });
      bkEls.forEach((el) => el.addEventListener("click", () => { idx = Number(el.dataset.bk); sync(); }));
      bmBtn.addEventListener("click", () => {
        saved = !saved;
        bmBtn.setAttribute("aria-pressed", String(saved));
        bmBtn.textContent = saved ? "★ Saved" : "☆ Save";
        bmBtn.style.color = saved ? "#e11d48" : "";
      });
      sync();
    }

    else if (id === "relay-triage") {
      container.innerHTML = `
        <div class="uiw uiw-relay">
          <div class="uiw-head">
            <span class="uiw-stat-pill uiw-mono">ML-402</span>
            <span class="uiw-stat-pill" data-st style="background:#eef2ff;color:#4338ca">● In Review</span>
          </div>
          <div>
            <div style="font-size:19px;font-weight:700;letter-spacing:-0.025em">Spring Physics Engine</div>
            <div class="uiw-h-sub" style="margin-top:4px">Interruptible gesture curves &amp; reduced-motion guard.</div>
          </div>
          <div class="uiw-relay-props">
            <div>
              <div style="font-size:11px;color:#8b8b96;margin-bottom:5px">Priority</div>
              <button type="button" class="uiw-relay-pill" data-prio>● Medium</button>
            </div>
            <div>
              <div style="font-size:11px;color:#8b8b96;margin-bottom:5px">QA Checks</div>
              <div style="font-size:12px;font-weight:600" data-checks>11 / 12 passed</div>
              <div class="uiw-prog-track" style="margin-top:5px"><div class="uiw-prog-fill" data-bar style="width:78%;background:#6366f1"></div></div>
            </div>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding-top:10px;border-top:1px solid rgba(15,23,42,0.08)">
            <div style="display:flex;gap:6px">
              <button type="button" class="uiw-react-chip" aria-pressed="false" data-react="fire">🔥 <span data-cnt>12</span></button>
              <button type="button" class="uiw-react-chip" aria-pressed="false" data-react="zap">⚡ <span data-cnt>8</span></button>
            </div>
            <button type="button" class="uiw-ship-btn" data-ship>Ship PR</button>
          </div>
        </div>
      `;

      let urgent = false;
      let shipped = false;
      const prioBtn = container.querySelector("[data-prio]");
      const stEl = container.querySelector("[data-st]");
      const shipBtn = container.querySelector("[data-ship]");
      const checksEl = container.querySelector("[data-checks]");
      const barEl = container.querySelector("[data-bar]");

      prioBtn.addEventListener("click", () => {
        urgent = !urgent;
        prioBtn.classList.toggle("is-urgent", urgent);
        prioBtn.textContent = urgent ? "▲ Urgent" : "● Medium";
      });

      shipBtn.addEventListener("click", () => {
        shipped = !shipped;
        shipBtn.classList.toggle("is-shipped", shipped);
        shipBtn.textContent = shipped ? "✓ Shipped" : "Ship PR";
        stEl.textContent = shipped ? "● Shipped" : "● In Review";
        stEl.style.background = shipped ? "#ecfdf5" : "#eef2ff";
        stEl.style.color = shipped ? "#059669" : "#4338ca";
        checksEl.textContent = shipped ? "12 / 12 passed" : "11 / 12 passed";
        barEl.style.width = shipped ? "100%" : "78%";
        barEl.style.background = shipped ? "#10b981" : "#6366f1";
      });

      container.querySelectorAll("[data-react]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const active = btn.getAttribute("aria-pressed") === "true";
          const next = !active;
          btn.setAttribute("aria-pressed", String(next));
          const cnt = btn.querySelector("[data-cnt]");
          cnt.textContent = String(Number(cnt.textContent) + (next ? 1 : -1));
        });
      });
    }

    return {
      destroy() {
        cleanups.forEach((fn) => {
          try { fn(); } catch (_) {}
        });
      }
    };
  }

  window.MotionLabComponentsRuntime = { mountComponent };
})();
