#!/bin/sh
# Runs the Vite dev server with the Worker, on D1 or, with `postgresql` as argument, on the database of docker-compose.yml.
set -e

# The secrets of the Worker in local development, from the .env of the repository
echo "DAM_SECRET=$DAM_SECRET" > .dev.vars

if [ "$1" = "postgresql" ]; then
    export CLOUDFLARE_ENV=postgresql
    # The database of scripts/database.ts, which Hyperdrive connects to locally
    export CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE="postgres://$POSTGRESQL_USER:$POSTGRESQL_PWD_DECODED@$POSTGRESQL_HOST:$POSTGRESQL_PORT/${POSTGRESQL_DB}_cloudflare_gen"
fi

exec vite
