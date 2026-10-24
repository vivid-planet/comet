#!/bin/sh
# Runs the Worker locally in workerd (with a local R2 bucket) against the Postgres and imgproxy containers of docker-compose.yml.
# imgproxy can't read the local R2 bucket, so it loads the images from the public DAM URLs of the Worker via host.docker.internal.
set -e

export CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE="postgres://$POSTGRESQL_USER:$POSTGRESQL_PWD_DECODED@localhost:$POSTGRESQL_PORT/$POSTGRESQL_DB"

exec wrangler dev --ip 0.0.0.0 --port "$API_HONO_WORKER_PORT" \
    --var "DAM_SECRET:$DAM_SECRET" \
    --var "IMGPROXY_URL:$IMGPROXY_URL" \
    --var "IMGPROXY_KEY:$IMGPROXY_KEY" \
    --var "IMGPROXY_SALT:$IMGPROXY_SALT" \
    --var "BLOB_STORAGE_DIRECTORY_PREFIX:$BLOB_STORAGE_DIRECTORY_PREFIX" \
    --var "API_HONO_TOKEN:$API_HONO_TOKEN" \
    --var "API_HONO_PUBLIC_URL:http://host.docker.internal:$API_HONO_WORKER_PORT"
