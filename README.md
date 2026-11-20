# Motion Lab

An independent, zero-dependency interactive UI motion playground and parameter workbench built with semantic HTML, CSS custom properties, and Vanilla JavaScript.

- **Live Website**: https://17860288878k-debug.github.io/motion-lab/
- **Repository**: https://github.com/17860288878k-debug/motion-lab

---

## Features

- **12 Live Interactive Motion Studies** across 4 categories (`Surfaces`, `Navigation`, `Feedback`, `Micro-Motion`) — every card triggers real CSS/JS animations (Click, Hover, Open, Close, Replay, Mid-flight Interruption).
- **Dedicated Workbench (`study.html?id=<slug>`)** for every study with:
  - Live CSS variable tuning sliders (duration, distance, scale, blur, stagger)
  - Interactive cubic-bezier curve selector + real-time SVG curve plot
  - Playback speed control (`1×`, `0.5×`, `0.25×` slow-motion)
  - Live `prefers-reduced-motion` simulator
  - Live interaction telemetry log & active CSS token readout
- **Easing Curve Race Track (`tokens.html`)** to compare 6 core easing curves side-by-side at any duration.
- **Light & Dark Themes**, responsive desktop & mobile layouts, self-hosted SIL OFL 1.1 typography (`Inter` & `Roboto Mono`), and zero backend dependencies.

---

## Local Development

No build step or npm install is required. Serve with Python 3 (or any static HTTP server):

```bash
python3 -m http.server 8780 --bind 127.0.0.1
```

Open `http://127.0.0.1:8780/`.

To verify GitHub Pages subpath behavior locally (`/motion-lab/`), serve from the parent directory:

```bash
cd ..
python3 -m http.server 8780 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8780/motion-lab/`.

---

## Editing & Updating the Site

1. **Add or tune a Motion Study**:
   - Edit metadata and slider schemas in `assets/js/studies-data.js`.
   - Add or update styles/tokens in `assets/css/studies.css`.
   - Add or update interactive behavior in `assets/js/studies-runtime.js`.
2. **Edit site visual design or layout**:
   - Update theme colors, typography, and spacing in `assets/css/design-system.css`.
3. **Publish updates to GitHub Pages**:
   ```bash
   git status
   git add .
   git commit -m "feat: update motion studies"
   git push origin main
   ```
   GitHub Pages automatically rebuilds and updates `https://17860288878k-debug.github.io/motion-lab/` within ~1 minute after pushing to `main`.

---

## License & Third-Party Attribution

- Original Motion Lab source code is licensed under the [MIT License](LICENSE).
- Third-party open-source attributions (including Transitions.dev motion principles and SIL OFL 1.1 fonts `Inter` & `Roboto Mono`) are documented in [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md) and `about.html`.
