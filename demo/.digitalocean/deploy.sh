#!/usr/bin/env bash
set -euo pipefail

# Usage (from the repository root, after `pnpm install` and `pnpm --filter @dextinity/cli run build`):
#   demo/.digitalocean/deploy.sh create   # first deployment, prints the app IDs to put into secrets.env
#   demo/.digitalocean/deploy.sh update   # apply spec changes and deploy the current state of the configured branch
#
# Secrets are read from demo/.digitalocean/secrets.env (see secrets.env.example), which must never be committed.

cd "$(dirname "$0")/../.."

command=${1:-}
dir=demo/.digitalocean

set -a
# shellcheck source=/dev/null
. "$dir/secrets.env"
set +a

secretVariables='${API_BASIC_AUTH_SYSTEM_USER_PASSWORD} ${BREVO_API_KEY} ${BREVO_CAMPAIGN_BASIC_AUTH_PASSWORD} ${BREVO_ECG_RTR_LIST_API_KEY} ${DAM_SECRET} ${FILE_UPLOADS_DOWNLOAD_SECRET} ${IDP_CLIENT_ID} ${IMGPROXY_KEY} ${IMGPROXY_SALT} ${OAUTH2_PROXY_CLIENT_SECRET} ${OAUTH2_PROXY_COOKIE_SECRET} ${POSTGRESQL_PWD_BASE64} ${S3_ACCESS_KEY_ID} ${S3_SECRET_ACCESS_KEY} ${SITE_PREVIEW_SECRET}'

for app in cms site; do
    pnpm exec dextinity inject-site-configs -f demo/site-configs/site-configs.ts -i "$dir/dextinity-demo-$app.tpl.yaml" -o "$dir/dextinity-demo-$app.yaml" --base64
    envsubst "$secretVariables" <"$dir/dextinity-demo-$app.yaml" >"$dir/dextinity-demo-$app.yaml.tmp"
    mv "$dir/dextinity-demo-$app.yaml.tmp" "$dir/dextinity-demo-$app.yaml"
done

case "$command" in
create)
    doctl apps create --spec "$dir/dextinity-demo-cms.yaml"
    doctl apps create --spec "$dir/dextinity-demo-site.yaml"
    ;;
update)
    doctl apps update "$DEMO_CMS_APP_ID" --spec "$dir/dextinity-demo-cms.yaml"
    doctl apps create-deployment "$DEMO_CMS_APP_ID"
    doctl apps update "$DEMO_SITE_APP_ID" --spec "$dir/dextinity-demo-site.yaml"
    doctl apps create-deployment "$DEMO_SITE_APP_ID"
    ;;
*)
    echo "Usage: $0 create|update" >&2
    exit 1
    ;;
esac
