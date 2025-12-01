#!/usr/bin/env bash
. ~/.nvm/nvm.sh

# jump into project dir
cd $(dirname $0)

# use correct node version and install dependencies
nvm install
nvm use
corepack enable

pnpm install

pnpm run copy-project-files

# Lang install demo
sh ./demo/admin/intl-update.sh
sh ./demo/api/intl-update.sh
sh ./demo/site/intl-update.sh
sh ./demo/site-pages/intl-update.sh

# Lang install demo-saas
sh ./demo-saas/admin/intl-update.sh
sh ./demo-saas/api/intl-update.sh

# Build the packages CLI and eslint-plugin to be used for dev startup
pnpm --filter '@comet/cli' --filter '@comet/eslint-plugin' run build

# create site-config-envs
pnpm run create-site-configs-env

# Download oauth2-proxy and mitmproxy in demo and demo-saas
pnpm --filter 'comet-demo' run setup:download-oauth2-proxy
pnpm --filter 'comet-demo' run setup:download-mitmproxy
pnpm --filter 'comet-demo-saas' run setup:download-oauth2-proxy
pnpm --filter 'comet-demo-saas' run setup:download-mitmproxy
