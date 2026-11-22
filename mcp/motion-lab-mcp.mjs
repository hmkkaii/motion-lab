#!/usr/bin/env node
/**
 * Motion Lab v2.0 — Zero-Dependency Stdio MCP Server (Node.js >= 18 ESM)
 *
 * Exposes Motion Lab's 12 interactive motion studies, 8 interactive UI components,
 * and core motion tokens to Claude Code, Cursor, Codex, Antigravity, and any
 * MCP-compatible AI client over stdio JSON-RPC 2.0.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import readline from "node:readline";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const LOCAL_REGISTRY = resolve(REPO_ROOT, "registry.json");
const LOCAL_LLMS = resolve(REPO_ROOT, "llms.txt");
const REMOTE_REGISTRY_URL = "https://hmkkaii.github.io/motion-lab/registry.json";
const REMOTE_LLMS_URL = "https://hmkkaii.github.io/motion-lab/llms.txt";

const SERVER_INFO = { name: "motion-lab", version: "2.0.0" };
const PROTOCOL_VERSION = "2024-11-05";

let registryCache = null;

async function loadRegistry() {
  if (registryCache) return registryCache;
  if (existsSync(LOCAL_REGISTRY)) {
    registryCache = JSON.parse(readFileSync(LOCAL_REGISTRY, "utf8"));
    return registryCache;
  }
  const res = await fetch(REMOTE_REGISTRY_URL);
  if (!res.ok) throw new Error(`Failed to fetch registry.json (${res.status})`);
  registryCache = await res.json();
  return registryCache;
}

async function loadLlmsTxt() {
  if (existsSync(LOCAL_LLMS)) return readFileSync(LOCAL_LLMS, "utf8");
  const res = await fetch(REMOTE_LLMS_URL);
  if (!res.ok) throw new Error(`Failed to fetch llms.txt (${res.status})`);
  return await res.text();
}

const TOOLS = [
  {
    name: "list_motions",
    description: "List Motion Lab's 12 interactive UI motion studies with category, timing spec, triggers, easing curve, and live workbench URL. Optionally filter by category (Surfaces, Navigation, Feedback, Micro-Motion).",
    inputSchema: {
      type: "object",
      properties: {
        category: { type: "string", description: "Optional category filter: Surfaces, Navigation, Feedback, or Micro-Motion." }
      },
      additionalProperties: false
    }
  },
  {
    name: "get_motion_spec",
    description: "Get full implementation details for a specific Motion Lab motion study (exact CSS, Vanilla JS controller, tunable CSS variables, easing curve, rationale, and reduced-motion guard).",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Motion study slug, e.g. adaptive-card, origin-menu, scale-dialog, sliding-tabs, accordion-disclosure, page-transition, toast-stack, validation-shake, confirm-check, spring-like, drum-counter, hover-cluster." }
      },
      required: ["id"],
      additionalProperties: false
    }
  },
  {
    name: "list_components",
    description: "List Motion Lab's 8 interactive UI showcase components with category, triggers, motion tokens, and live preview URL. Optionally filter by category (Controls, Cards, Media, Creative, Productivity, Developer).",
    inputSchema: {
      type: "object",
      properties: {
        category: { type: "string", description: "Optional category filter: Controls, Cards, Media, Creative, Productivity, or Developer." }
      },
      additionalProperties: false
    }
  },
  {
    name: "get_component_code",
    description: "Get complete zero-dependency CSS (shared widget shell + component CSS) and Vanilla JS + HTML implementation for one of Motion Lab's 8 interactive UI components.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Component slug: pulse-climate, orbit-flight, tempo-audio, chroma-mesh, focus-timer, forge-deploy, shelf-books, or relay-triage." }
      },
      required: ["id"],
      additionalProperties: false
    }
  },
  {
    name: "get_easing_tokens",
    description: "Return Motion Lab's 6 core cubic-bezier easing curves, 7 semantic duration tokens, ready-to-paste :root CSS block, and 5 motion engineering principles.",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false
    }
  }
];

const RESOURCES = [
  {
    uri: "motion-lab://registry",
    name: "Motion Lab Complete Registry (JSON)",
    description: "All 12 motion studies, 8 interactive UI components, and tokens in structured JSON.",
    mimeType: "application/json"
  },
  {
    uri: "motion-lab://tokens",
    name: "Motion Lab Core CSS Tokens",
    description: "Ready-to-paste :root CSS duration and cubic-bezier easing tokens.",
    mimeType: "text/css"
  },
  {
    uri: "motion-lab://llms",
    name: "Motion Lab llms.txt Index",
    description: "Concise Markdown index of Motion Lab endpoints, studies, and components.",
    mimeType: "text/markdown"
  }
];

async function callTool(name, args = {}) {
  const reg = await loadRegistry();

  if (name === "list_motions") {
    const cat = String(args.category || "").trim().toLowerCase();
    const list = reg.motions
      .filter((m) => !cat || cat === "all" || m.category.toLowerCase() === cat)
      .map((m) => ({
        id: m.id,
        title: m.title,
        category: m.category,
        specLabel: m.specLabel,
        defaultEasing: m.defaultEasing,
        triggers: m.triggers,
        tagline: m.tagline,
        workbenchUrl: m.workbenchUrl
      }));
    return { content: [{ type: "text", text: JSON.stringify({ count: list.length, motions: list }, null, 2) }] };
  }

  if (name === "get_motion_spec") {
    const mid = String(args.id || "").trim().toLowerCase();
    const match = reg.motions.find((m) => m.id.toLowerCase() === mid);
    if (!match) {
      return { isError: true, content: [{ type: "text", text: `Unknown motion study '${mid}'. Valid IDs: ${reg.motions.map((m) => m.id).join(", ")}` }] };
    }
    return {
      content: [{ type: "text", text: JSON.stringify({ ...match, tokensCss: reg.tokens.cssRootBlock, reducedMotionCss: reg.reducedMotionCss }, null, 2) }]
    };
  }

  if (name === "list_components") {
    const cat = String(args.category || "").trim().toLowerCase();
    const list = reg.components
      .filter((c) => !cat || cat === "all" || c.category.toLowerCase() === cat)
      .map((c) => ({
        id: c.id,
        title: c.title,
        category: c.category,
        triggers: c.triggers,
        tokens: c.tokens,
        tagline: c.tagline,
        previewUrl: c.previewUrl
      }));
    return { content: [{ type: "text", text: JSON.stringify({ count: list.length, components: list }, null, 2) }] };
  }

  if (name === "get_component_code") {
    const cid = String(args.id || "").trim().toLowerCase();
    const match = reg.components.find((c) => c.id.toLowerCase() === cid);
    if (!match) {
      return { isError: true, content: [{ type: "text", text: `Unknown component '${cid}'. Valid IDs: ${reg.components.map((c) => c.id).join(", ")}` }] };
    }
    return {
      content: [{ type: "text", text: JSON.stringify({ ...match, tokensCss: reg.tokens.cssRootBlock, reducedMotionCss: reg.reducedMotionCss }, null, 2) }]
    };
  }

  if (name === "get_easing_tokens") {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          tokens: reg.tokens,
          principles: reg.principles,
          reducedMotionCss: reg.reducedMotionCss,
          curveLabUrl: `${reg.homepage}tokens.html`
        }, null, 2)
      }]
    };
  }

  return { isError: true, content: [{ type: "text", text: `Unknown tool: ${name}` }] };
}

async function readResource(uri) {
  const reg = await loadRegistry();
  if (uri === "motion-lab://registry") {
    return { contents: [{ uri, mimeType: "application/json", text: JSON.stringify(reg, null, 2) }] };
  }
  if (uri === "motion-lab://tokens") {
    return { contents: [{ uri, mimeType: "text/css", text: `${reg.tokens.cssRootBlock}\n\n${reg.reducedMotionCss}` }] };
  }
  if (uri === "motion-lab://llms") {
    return { contents: [{ uri, mimeType: "text/markdown", text: await loadLlmsTxt() }] };
  }
  return null;
}

async function handleMessage(msg) {
  const { method, id, params = {} } = msg;
  if (method === "notifications/initialized" || (id === undefined && String(method || "").startsWith("notifications/"))) {
    return null;
  }
  if (method === "initialize") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: params.protocolVersion || PROTOCOL_VERSION,
        capabilities: {
          tools: { listChanged: false },
          resources: { subscribe: false, listChanged: false }
        },
        serverInfo: SERVER_INFO
      }
    };
  }
  if (method === "ping") return { jsonrpc: "2.0", id, result: {} };
  if (method === "tools/list") return { jsonrpc: "2.0", id, result: { tools: TOOLS } };
  if (method === "tools/call") return { jsonrpc: "2.0", id, result: await callTool(params.name, params.arguments) };
  if (method === "resources/list") return { jsonrpc: "2.0", id, result: { resources: RESOURCES } };
  if (method === "resources/read") {
    const res = await readResource(params.uri);
    if (!res) return { jsonrpc: "2.0", id, error: { code: -32602, message: `Unknown resource URI: ${params.uri}` } };
    return { jsonrpc: "2.0", id, result: res };
  }
  if (id !== undefined) {
    return { jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${method}` } };
  }
  return null;
}

const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
rl.on("line", async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  let msg;
  try {
    msg = JSON.parse(trimmed);
  } catch (err) {
    process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: `Parse error: ${err.message}` } })}\n`);
    return;
  }
  try {
    const resp = await handleMessage(msg);
    if (resp) process.stdout.write(`${JSON.stringify(resp)}\n`);
  } catch (err) {
    if (msg.id !== undefined) {
      process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", id: msg.id, error: { code: -32603, message: `Internal error: ${err.message}` } })}\n`);
    }
  }
});
