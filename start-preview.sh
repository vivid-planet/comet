#!/usr/bin/env bash
set -e

# Starts the demo as a preview environment: builds the image and brings the compose project up,
# blocking until it is healthy. A preview controller only has to run this script and gets a running
# compose project.
#
# Configured through the environment, all optional:
#
#   COMPOSE_PROJECT_NAME      compose project to create (default dextinity-demo-preview)
#   DEPLOY_PREVIEW_PORT       host port the environment is published on (default 8080)
#   DEPLOY_PREVIEW_HOST       public host incl. port (default demo.preview.localhost:<DEPLOY_PREVIEW_PORT>)
#   DEPLOY_PREVIEW_SCHEME     http or https (default http)
#   DEPLOY_PREVIEW_URLS_FILE  file to report the urls of this preview to, one "<name>=<url>" per line
#
# Without any of them it starts the preview environment on http://demo.preview.localhost:8080.
#
# Everything besides the site lives one label next to the base domain and not below it -
# admin--<host> and not admin.<host> - so that one wildcard certificate covers it.
#
# See .docker-preview/README.md for details.

cd "$(dirname "$0")"

export DEPLOY_PREVIEW_PORT="${DEPLOY_PREVIEW_PORT:-8080}"
export DEPLOY_PREVIEW_SCHEME="${DEPLOY_PREVIEW_SCHEME:-http}"
export DEPLOY_PREVIEW_HOST="${DEPLOY_PREVIEW_HOST:-demo.preview.localhost:$DEPLOY_PREVIEW_PORT}"
if [[ "$DEPLOY_PREVIEW_SCHEME" == "https" ]]
then
    export DEPLOY_PREVIEW_COOKIE_SECURE=true
else
    export DEPLOY_PREVIEW_COOKIE_SECURE=false
fi

docker compose -p "${COMPOSE_PROJECT_NAME:-dextinity-demo-preview}" -f .docker-preview/docker-compose.yml \
    --project-directory . up --build -d --wait

# Tell the caller which domains this project serves, so it can link to them.
if [[ -n "${DEPLOY_PREVIEW_URLS_FILE:-}" ]]
then
    cat > "$DEPLOY_PREVIEW_URLS_FILE" <<URLS
Site=$DEPLOY_PREVIEW_SCHEME://$DEPLOY_PREVIEW_HOST
Admin=$DEPLOY_PREVIEW_SCHEME://admin--$DEPLOY_PREVIEW_HOST
Mails=$DEPLOY_PREVIEW_SCHEME://mail--$DEPLOY_PREVIEW_HOST
URLS
fi
