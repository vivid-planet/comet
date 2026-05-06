#!/bin/bash
set -euo pipefail

# Only run in Claude Code on the web (remote) sessions.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
    exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# 1. Install dependencies (idempotent — skips when node_modules already exists).
if [ ! -d node_modules ]; then
    echo "[session-start] Installing dependencies..." >&2
    NODE_USE_ENV_PROXY=1 ./install.sh
fi

# 2. Start the Docker daemon if it is not already running.
if ! docker info >/dev/null 2>&1; then
    echo "[session-start] Starting Docker daemon..." >&2
    sudo -n dockerd >/tmp/dockerd.log 2>&1 &
    for _ in $(seq 1 30); do
        if docker info >/dev/null 2>&1; then
            break
        fi
        sleep 1
    done
    if ! docker info >/dev/null 2>&1; then
        echo "[session-start] Docker daemon did not become ready within 30s" >&2
        exit 1
    fi
fi

# 3. Start the demo Docker stack via dev-pm (postgres, valkey, mailpit, jaeger, imgproxy).
echo "[session-start] Starting demo-docker via dev-pm..." >&2
pnpm exec -- dev-pm start demo-docker
