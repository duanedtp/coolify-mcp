# Using the Coolify MCP server with VS Code / Codex

These steps assume you already have a Coolify access token and base URL for your instance.

## 1) Install dependencies

```bash
npm install
npm run build
```

Building ensures the `dist/` output that the MCP launcher will execute is up to date.

## 2) Run the MCP server locally

From your fork or local clone, start the server via `npx` so VS Code can spawn it. Replace the repository/owner with your fork (for example `duanedtp/coolify-mcp`):

```bash
npx -y github:duanedtp/coolify-mcp
```

If you prefer to run the built output directly from a local checkout, point Node at the `dist` entry (after `npm run build`):

```bash
node /absolute/path/to/coolify-mcp/dist/index.js
```

Either command reads the following environment variables:

- `COOLIFY_ACCESS_TOKEN` — your Coolify API token
- `COOLIFY_BASE_URL` — Coolify base URL (e.g., `https://dev.trad3mark.gy`)

You can export them in your shell before starting VS Code, or supply them directly from the Codex configuration.

## 3) Configure Codex (VS Code)

Add an entry to your `config.toml` (for example at `~/.codex/config.toml`). Use the `args` that match your fork/clone:

```toml
[mcp_servers.coolify]
command = "npx"
args = ["-y", "github:duanedtp/coolify-mcp"]
startup_timeout_sec = 30
tool_timeout_sec = 180
env = { \
  COOLIFY_ACCESS_TOKEN = "0|your-access-token", \
  COOLIFY_BASE_URL = "https://your.coolify.instance" \
}
```

If you are running from a local clone instead, the same block would look like:

```toml
[mcp_servers.coolify]
command = "node"
args = ["/absolute/path/to/coolify-mcp/dist/index.js"]
startup_timeout_sec = 30
tool_timeout_sec = 180
env = { \
  COOLIFY_ACCESS_TOKEN = "0|your-access-token", \
  COOLIFY_BASE_URL = "https://your.coolify.instance" \
}
```

> Tip: match the `COOLIFY_BASE_URL` to the domain your token was created for (e.g., `https://dev.trad3mark.gy`).

## 4) Validate the connection inside Codex

1. Restart VS Code so Codex reloads the MCP server entry.
2. Ask Codex for a simple action like "List all Coolify projects" to verify connectivity.
3. If you see connection errors, double-check the token, base URL, and that your Coolify instance allows API access from your network.

## 5) Iterating during development

- Re-run `npm run build` after code changes so the `dist/` output stays in sync.
- Keep the `npx -y github:duanedtp/coolify-mcp` command (or your local `node …/dist/index.js` path) in your Codex config so VS Code always spawns the local build.
- For logs while VS Code is running the server, open the MCP output channel (View > Output, then pick "MCP: coolify").
