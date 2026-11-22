#!/usr/bin/env python3
"""
Motion Lab v2.0 — Zero-Dependency Stdio MCP Server (Python 3)

Exposes Motion Lab's 12 interactive motion studies, 8 interactive UI components,
and core motion tokens to Claude Code, Cursor, Codex, Antigravity, and any
MCP-compatible AI client over stdio JSON-RPC 2.0.

Tools:
  - list_motions(category?)
  - get_motion_spec(id)
  - list_components(category?)
  - get_component_code(id)
  - get_easing_tokens()

Resources:
  - motion-lab://registry
  - motion-lab://tokens
  - motion-lab://llms
"""
import json
import os
import sys
import urllib.request
from pathlib import Path

SERVER_INFO = {
    "name": "motion-lab",
    "version": "2.0.0",
}
PROTOCOL_VERSION = "2024-11-05"
REMOTE_REGISTRY_URL = "https://17860288878k-debug.github.io/motion-lab/registry.json"
REMOTE_LLMS_URL = "https://17860288878k-debug.github.io/motion-lab/llms.txt"

REPO_ROOT = Path(__file__).resolve().parent.parent
LOCAL_REGISTRY = REPO_ROOT / "registry.json"
LOCAL_LLMS = REPO_ROOT / "llms.txt"

_REGISTRY_CACHE = None


def load_registry():
    global _REGISTRY_CACHE
    if _REGISTRY_CACHE is not None:
        return _REGISTRY_CACHE
    if LOCAL_REGISTRY.exists():
        _REGISTRY_CACHE = json.loads(LOCAL_REGISTRY.read_text(encoding="utf-8"))
        return _REGISTRY_CACHE
    req = urllib.request.Request(REMOTE_REGISTRY_URL, headers={"User-Agent": "motion-lab-mcp/2.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        _REGISTRY_CACHE = json.loads(resp.read().decode("utf-8"))
        return _REGISTRY_CACHE


def load_llms_txt():
    if LOCAL_LLMS.exists():
        return LOCAL_LLMS.read_text(encoding="utf-8")
    req = urllib.request.Request(REMOTE_LLMS_URL, headers={"User-Agent": "motion-lab-mcp/2.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        return resp.read().decode("utf-8")


TOOLS = [
    {
        "name": "list_motions",
        "description": "List Motion Lab's 12 interactive UI motion studies with category, timing spec, triggers, easing curve, and live workbench URL. Optionally filter by category (Surfaces, Navigation, Feedback, Micro-Motion).",
        "inputSchema": {
            "type": "object",
            "properties": {
                "category": {
                    "type": "string",
                    "description": "Optional category filter: Surfaces, Navigation, Feedback, or Micro-Motion."
                }
            },
            "additionalProperties": False
        }
    },
    {
        "name": "get_motion_spec",
        "description": "Get full implementation details for a specific Motion Lab motion study (exact CSS, Vanilla JS controller, tunable CSS variables, easing curve, rationale, and reduced-motion guard).",
        "inputSchema": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "string",
                    "description": "Motion study slug, e.g. adaptive-card, origin-menu, scale-dialog, sliding-tabs, accordion-disclosure, page-transition, toast-stack, validation-shake, confirm-check, spring-like, drum-counter, hover-cluster."
                }
            },
            "required": ["id"],
            "additionalProperties": False
        }
    },
    {
        "name": "list_components",
        "description": "List Motion Lab's 8 interactive UI showcase components with category, triggers, motion tokens, and live preview URL. Optionally filter by category (Controls, Cards, Media, Creative, Productivity, Developer).",
        "inputSchema": {
            "type": "object",
            "properties": {
                "category": {
                    "type": "string",
                    "description": "Optional category filter: Controls, Cards, Media, Creative, Productivity, or Developer."
                }
            },
            "additionalProperties": False
        }
    },
    {
        "name": "get_component_code",
        "description": "Get complete zero-dependency CSS (shared widget shell + component CSS) and Vanilla JS + HTML implementation for one of Motion Lab's 8 interactive UI components.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "string",
                    "description": "Component slug: pulse-climate, orbit-flight, tempo-audio, chroma-mesh, focus-timer, forge-deploy, shelf-books, or relay-triage."
                }
            },
            "required": ["id"],
            "additionalProperties": False
        }
    },
    {
        "name": "get_easing_tokens",
        "description": "Return Motion Lab's 6 core cubic-bezier easing curves, 7 semantic duration tokens, ready-to-paste :root CSS block, and 5 motion engineering principles.",
        "inputSchema": {
            "type": "object",
            "properties": {},
            "additionalProperties": False
        }
    }
]

RESOURCES = [
    {
        "uri": "motion-lab://registry",
        "name": "Motion Lab Complete Registry (JSON)",
        "description": "All 12 motion studies, 8 interactive UI components, and tokens in structured JSON.",
        "mimeType": "application/json"
    },
    {
        "uri": "motion-lab://tokens",
        "name": "Motion Lab Core CSS Tokens",
        "description": "Ready-to-paste :root CSS duration and cubic-bezier easing tokens.",
        "mimeType": "text/css"
    },
    {
        "uri": "motion-lab://llms",
        "name": "Motion Lab llms.txt Index",
        "description": "Concise Markdown index of Motion Lab endpoints, studies, and components.",
        "mimeType": "text/markdown"
    }
]


def call_tool(name, args):
    reg = load_registry()
    args = args or {}

    if name == "list_motions":
        cat = (args.get("category") or "").strip().lower()
        items = reg["motions"]
        if cat and cat != "all":
            items = [m for m in items if m["category"].lower() == cat]
        summary = [
            {
                "id": m["id"],
                "title": m["title"],
                "category": m["category"],
                "specLabel": m["specLabel"],
                "defaultEasing": m["defaultEasing"],
                "triggers": m["triggers"],
                "tagline": m["tagline"],
                "workbenchUrl": m["workbenchUrl"],
            }
            for m in items
        ]
        return {"content": [{"type": "text", "text": json.dumps({"count": len(summary), "motions": summary}, indent=2, ensure_ascii=False)}]}

    if name == "get_motion_spec":
        mid = (args.get("id") or "").strip().lower()
        match = next((m for m in reg["motions"] if m["id"].lower() == mid), None)
        if not match:
            valid = ", ".join(m["id"] for m in reg["motions"])
            return {"isError": True, "content": [{"type": "text", "text": f"Unknown motion study '{mid}'. Valid IDs: {valid}"}]}
        payload = dict(match)
        payload["tokensCss"] = reg["tokens"]["cssRootBlock"]
        payload["reducedMotionCss"] = reg["reducedMotionCss"]
        return {"content": [{"type": "text", "text": json.dumps(payload, indent=2, ensure_ascii=False)}]}

    if name == "list_components":
        cat = (args.get("category") or "").strip().lower()
        items = reg["components"]
        if cat and cat != "all":
            items = [c for c in items if c["category"].lower() == cat]
        summary = [
            {
                "id": c["id"],
                "title": c["title"],
                "category": c["category"],
                "triggers": c["triggers"],
                "tokens": c["tokens"],
                "tagline": c["tagline"],
                "previewUrl": c["previewUrl"],
            }
            for c in items
        ]
        return {"content": [{"type": "text", "text": json.dumps({"count": len(summary), "components": summary}, indent=2, ensure_ascii=False)}]}

    if name == "get_component_code":
        cid = (args.get("id") or "").strip().lower()
        match = next((c for c in reg["components"] if c["id"].lower() == cid), None)
        if not match:
            valid = ", ".join(c["id"] for c in reg["components"])
            return {"isError": True, "content": [{"type": "text", "text": f"Unknown component '{cid}'. Valid IDs: {valid}"}]}
        payload = dict(match)
        payload["tokensCss"] = reg["tokens"]["cssRootBlock"]
        payload["reducedMotionCss"] = reg["reducedMotionCss"]
        return {"content": [{"type": "text", "text": json.dumps(payload, indent=2, ensure_ascii=False)}]}

    if name == "get_easing_tokens":
        payload = {
            "tokens": reg["tokens"],
            "principles": reg["principles"],
            "reducedMotionCss": reg["reducedMotionCss"],
            "curveLabUrl": f"{reg['homepage']}tokens.html"
        }
        return {"content": [{"type": "text", "text": json.dumps(payload, indent=2, ensure_ascii=False)}]}

    return {"isError": True, "content": [{"type": "text", "text": f"Unknown tool: {name}"}]}


def read_resource(uri):
    reg = load_registry()
    if uri == "motion-lab://registry":
        return {"contents": [{"uri": uri, "mimeType": "application/json", "text": json.dumps(reg, indent=2, ensure_ascii=False)}]}
    if uri == "motion-lab://tokens":
        return {"contents": [{"uri": uri, "mimeType": "text/css", "text": reg["tokens"]["cssRootBlock"] + "\n\n" + reg["reducedMotionCss"]}]}
    if uri == "motion-lab://llms":
        return {"contents": [{"uri": uri, "mimeType": "text/markdown", "text": load_llms_txt()}]}
    return None


def handle_message(msg):
    method = msg.get("method")
    req_id = msg.get("id")
    params = msg.get("params") or {}

    # Notifications have no id and expect no response
    if method == "notifications/initialized" or (req_id is None and method and method.startswith("notifications/")):
        return None

    if method == "initialize":
        client_ver = params.get("protocolVersion") or PROTOCOL_VERSION
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {
                "protocolVersion": client_ver,
                "capabilities": {
                    "tools": {"listChanged": False},
                    "resources": {"subscribe": False, "listChanged": False}
                },
                "serverInfo": SERVER_INFO
            }
        }

    if method == "ping":
        return {"jsonrpc": "2.0", "id": req_id, "result": {}}

    if method == "tools/list":
        return {"jsonrpc": "2.0", "id": req_id, "result": {"tools": TOOLS}}

    if method == "tools/call":
        result = call_tool(params.get("name"), params.get("arguments"))
        return {"jsonrpc": "2.0", "id": req_id, "result": result}

    if method == "resources/list":
        return {"jsonrpc": "2.0", "id": req_id, "result": {"resources": RESOURCES}}

    if method == "resources/read":
        uri = params.get("uri")
        res = read_resource(uri)
        if res is None:
            return {"jsonrpc": "2.0", "id": req_id, "error": {"code": -32602, "message": f"Unknown resource URI: {uri}"}}
        return {"jsonrpc": "2.0", "id": req_id, "result": res}

    if req_id is not None:
        return {"jsonrpc": "2.0", "id": req_id, "error": {"code": -32601, "message": f"Method not found: {method}"}}
    return None


def write_response(resp, framed=False):
    payload = json.dumps(resp, ensure_ascii=False)
    if framed:
        data = payload.encode("utf-8")
        sys.stdout.buffer.write(f"Content-Length: {len(data)}\r\n\r\n".encode("ascii") + data)
        sys.stdout.buffer.flush()
    else:
        sys.stdout.write(payload + "\n")
        sys.stdout.flush()


def main():
    stdin = sys.stdin.buffer
    while True:
        line = stdin.readline()
        if not line:
            break
        stripped = line.strip()
        if not stripped:
            continue

        framed = False
        raw = None
        if stripped.lower().startswith(b"content-length:"):
            framed = True
            length = int(stripped.split(b":", 1)[1].strip())
            # Read remaining headers until blank line
            while True:
                h = stdin.readline()
                if not h or h in (b"\r\n", b"\n"):
                    break
            raw = stdin.read(length)
        else:
            raw = stripped

        try:
            msg = json.loads(raw.decode("utf-8"))
        except Exception as exc:
            write_response(
                {"jsonrpc": "2.0", "id": None, "error": {"code": -32700, "message": f"Parse error: {exc}"}},
                framed=framed
            )
            continue

        try:
            resp = handle_message(msg)
            if resp is not None:
                write_response(resp, framed=framed)
        except Exception as exc:
            if msg.get("id") is not None:
                write_response(
                    {"jsonrpc": "2.0", "id": msg.get("id"), "error": {"code": -32603, "message": f"Internal error: {exc}"}},
                    framed=framed
                )


if __name__ == "__main__":
    main()
