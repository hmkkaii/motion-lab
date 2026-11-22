# Motion Lab v2.0

**Building blocks for interactive UI, ready to use as a library, Agent Skill, or MCP server with Claude Code, Cursor, Codex, and Antigravity.**

Zero-dependency semantic HTML, CSS custom properties, and Vanilla JavaScript — with live clickable previews, real-time parameter tuning, and machine-readable AI endpoints.

- **Live Website**: https://hmkkaii.github.io/motion-lab/
- **Interactive UI Components**: https://hmkkaii.github.io/motion-lab/components.html
- **Skill & MCP Setup Hub**: https://hmkkaii.github.io/motion-lab/ai.html
- **Machine Registry (`registry.json`)**: https://hmkkaii.github.io/motion-lab/registry.json
- **LLM Index (`llms.txt`)**: https://hmkkaii.github.io/motion-lab/llms.txt
- **Repository**: https://github.com/hmkkaii/motion-lab

---

## What's Included (20 Live Interactive Blocks)

### 12 Interactive Motion Studies (`index.html` + `study.html`)
- **Surfaces**: `adaptive-card`, `origin-menu`, `scale-dialog`
- **Navigation**: `sliding-tabs`, `accordion-disclosure`, `page-transition`
- **Feedback**: `toast-stack`, `validation-shake`, `confirm-check`
- **Micro-Motion**: `spring-like`, `drum-counter`, `hover-cluster`
- Every study opens in a dedicated **Workbench** with live CSS sliders, cubic-bezier SVG plot, slow-motion (`1×`, `0.5×`, `0.25×`), `prefers-reduced-motion` simulator, and one-click **Copy CSS** / **Copy for AI**.

### 8 Interactive UI Showcase Components (`components.html`)
- **Pulse Climate Dial** (`pulse-climate`): 36-tick radial thermostat, glowing arc, stepper buttons, and Eco / Comfort / Warm Glow pill.
- **Orbit Live Flight Pass** (`orbit-flight`): Cobalt great-circle Bezier route tracker with tangent aircraft icon and live gate tabs.
- **Tempo Spatial Audio Deck** (`tempo-audio`): Vinyl player with 18-bar animated equalizer and Studio / Warm / Spatial presets.
- **Chroma Palette Studio** (`chroma-mesh`): Crossfading radial mesh studio with live OKLCH readout and one-click CSS copy.
- **Focus Deep Work Timer** (`focus-timer`): SVG countdown ring with tabular digits and ambient sound toggles.
- **Forge Edge Deploy Pipeline** (`forge-deploy`): 4-stage staggered release cascade with spring checkmarks.
- **Design Shelf 3D Deck** (`shelf-books`): Perspective book cover-flow with reading progress bar and bookmark toggle.
- **Relay Issue Triage Card** (`relay-triage`): Priority escalation, Ship PR morph, QA progress bar, and reaction counters.

### Easing Curve Lab (`tokens.html`)
- Synchronized 6-curve race track (`--ease-smooth-out`, `--ease-bounce`, `--ease-pop`, `--ease-bounce-strong`, `--ease-in-out`, `--ease-out`) + one-click **Copy `:root` Tokens**.

---

## Use with AI Coding Agents (Claude Code, Cursor, Codex, Antigravity)

### Option A: Zero-Install via `llms.txt` / `registry.json`
Paste into any AI coding agent with web fetch:

> Read `https://hmkkaii.github.io/motion-lab/llms.txt` and `https://hmkkaii.github.io/motion-lab/registry.json`, then implement `"origin-menu"` and `"pulse-climate"` in my project using Motion Lab's exact cubic-bezier curves and reduced-motion guards.

### Option B: Install the Agent Skill (`SKILL.md`)
```bash
git clone https://github.com/hmkkaii/motion-lab.git ~/motion-lab

# Claude Code
mkdir -p ~/.claude/skills/motion-lab
cp ~/motion-lab/skills/motion-lab/SKILL.md ~/.claude/skills/motion-lab/SKILL.md

# Codex CLI
mkdir -p ~/.codex/skills/motion-lab
cp ~/motion-lab/skills/motion-lab/SKILL.md ~/.codex/skills/motion-lab/SKILL.md
```

### Option C: Connect the Zero-Dependency MCP Server
Two identical zero-dependency stdio MCP servers are included:
- **Python 3** (no `pip install` needed): `mcp/motion-lab-mcp.py`
- **Node.js ≥ 18** (no `npm install` needed): `mcp/motion-lab-mcp.mjs`

**Claude Code:**
```bash
claude mcp add motion-lab -- python3 ~/motion-lab/mcp/motion-lab-mcp.py
# or with Node.js >= 18:
# claude mcp add motion-lab -- node ~/motion-lab/mcp/motion-lab-mcp.mjs
```

**Cursor (`.cursor/mcp.json`):**
```json
{
  "mcpServers": {
    "motion-lab": {
      "command": "python3",
      "args": ["/ABSOLUTE/PATH/TO/motion-lab/mcp/motion-lab-mcp.py"]
    }
  }
}
```

**Codex CLI (`~/.codex/config.toml`):**
```toml
[mcp_servers.motion-lab]
command = "python3"
args = ["/ABSOLUTE/PATH/TO/motion-lab/mcp/motion-lab-mcp.py"]
```

**Exposed MCP Tools (5) & Resources (3):**
- `list_motions(category?)`
- `get_motion_spec(id)`
- `list_components(category?)`
- `get_component_code(id)`
- `get_easing_tokens()`
- Resources: `motion-lab://registry`, `motion-lab://tokens`, `motion-lab://llms`

---

## Local Development

No build step or package install is required:

```bash
python3 -m http.server 8780 --bind 127.0.0.1
```

To verify GitHub Pages subpath behavior (`/motion-lab/`), serve from the parent directory and open `http://127.0.0.1:8780/motion-lab/`.

---

## License & Third-Party Attribution

- Original Motion Lab source code is licensed under the [MIT License](LICENSE).
- Third-party open-source attributions (including Transitions.dev motion principles and SIL OFL 1.1 fonts `Inter` & `Roboto Mono`) are documented in [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md) and `about.html`.
