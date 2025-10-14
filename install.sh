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

# Lang install
sh ./demo/admin/intl-update.sh
sh ./demo/site/intl-update.sh
sh ./demo/site-pages/intl-update.sh

# Build the packages CLI and eslint-plugin to be used for dev startup
pnpm --filter '@comet/cli' --filter '@comet/eslint-plugin' run build

# create site-config-envs
pnpm run create-site-configs-env

# Download OAuth2-Proxy binary and create symlink to start
./install-oauth2-proxy.sh
