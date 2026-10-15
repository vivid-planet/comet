#!/bin/sh
# Renders the site configs for the host the environment is served under (SITE_DOMAIN, see
# demo/site-configs) and runs the command with them in its environment. The image itself does not
# know the host, so that the same image can serve any preview.
set -e

site_configs_file="$(mktemp)"
(cd /app && ./node_modules/.bin/dextinity inject-site-configs -f demo/site-configs/site-configs.ts -i demo/.env.site-configs.tpl -o "$site_configs_file" --base64 > /dev/null)
set -a
. "$site_configs_file"
set +a
rm "$site_configs_file"

exec "$@"
