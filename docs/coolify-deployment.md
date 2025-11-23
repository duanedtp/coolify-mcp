# Deploying the Coolify MCP server in Coolify or Docker

You can run this MCP server inside a Coolify project or locally via Docker. MCP clients (Codex, Claude, Cursor) communicate over **stdio**, so the container needs to be started by the client (e.g., `docker run ...` on the same machine as your editor) or via an SSH-capable Coolify service.

> Do I need the Dockerfile? No—Coolify can build directly from the Git repo without a custom Dockerfile. The Dockerfile here exists for local `docker build`/`docker run` workflows and for the Coolify build pipeline if you prefer Docker-based deployments. If Coolify builds from this Dockerfile, make sure `package-lock.json` is present in your branch; the Dockerfile now falls back to `npm install` when a lockfile is missing to avoid the `npm ci` error you may have seen.

## Build and run locally with Docker

```bash
docker build -t coolify-mcp .

docker run --rm -it \
  -e COOLIFY_ACCESS_TOKEN=0|your-token \
  -e COOLIFY_BASE_URL=https://your.coolify.instance \
  coolify-mcp
```

You can swap `coolify-mcp` with a published image tag if you push it to a registry that Coolify or your workstation can pull from.

### Codex `config.toml` using the Docker image

Point Codex at the container by letting it spawn `docker run` (Codex must be able to execute Docker locally):

```toml
[mcp_servers.coolify]
command = "docker"
args = [
  "run", "--rm", "-i",
  "-e", "COOLIFY_ACCESS_TOKEN=0|your-token",
  "-e", "COOLIFY_BASE_URL=https://your.coolify.instance",
  "ghcr.io/your-org/coolify-mcp:latest"
]
startup_timeout_sec = 30
tool_timeout_sec = 180
```

Replace the image reference with your built tag (e.g., `coolify-mcp:latest` when running locally).

## Running inside a Coolify project

1. Create a **Dockerfile** service in Coolify that builds from this repository.
2. Set environment variables in the Coolify service:
   - `COOLIFY_ACCESS_TOKEN` (required)
   - `COOLIFY_BASE_URL` (defaults to `http://localhost:3000` but should match your instance)
3. Choose a plan that supports **SSH** or container exec so your MCP client can attach via stdio. MCP currently requires a process you can spawn/attach to, not a public HTTP endpoint.
4. From your workstation, you can `ssh` into the Coolify deployment host and run:

```bash
docker run --rm -it \
  -e COOLIFY_ACCESS_TOKEN=0|your-token \
  -e COOLIFY_BASE_URL=https://your.coolify.instance \
  ghcr.io/your-org/coolify-mcp:latest
```

> Note: Because MCP relies on stdio, simply exposing the container over HTTP is not sufficient. You need a path (local Docker, SSH, or similar) for the editor to start or attach to the process.
