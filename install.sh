#!/usr/bin/env bash
. ~/.nvm/nvm.sh

# jump into project dir
cd $(dirname $0)

# use correct node version and install dependencies
nvm install
nvm use
npm i -g pnpm@8
pnpm install

# admin Blocks
ln -sf ../../api/blocks-api/block-meta.json ./packages/admin/blocks-admin/block-meta.json

# admin CMS
ln -sf ../../api/cms-api/schema.gql ./packages/admin/cms-admin/schema.gql
ln -sf ../../api/cms-api/block-meta.json ./packages/admin/cms-admin/block-meta.json

# site CMS
ln -sf ../../api/cms-api/block-meta.json ./packages/site/cms-site/block-meta.json

# api DEMO
ln -sf ../../.env ./demo/api/.env
ln -sf ../../.env.local ./demo/api/.env.local

# admin DEMO
ln -sf ../../.env ./demo/admin/.env
ln -sf ../api/schema.gql ./demo/admin/schema.gql
ln -sf ../api/block-meta.json ./demo/admin/block-meta.json
ln -sf ../../api/src/comet-config.json ./demo/admin/src/comet-config.json

# site DEMO
ln -sf ../../.env ./demo/site/.env
ln -sf ../api/schema.gql ./demo/site/schema.gql
ln -sf ../api/block-meta.json ./demo/site/block-meta.json
ln -sf ../../api/src/comet-config.json ./demo/site/src/comet-config.json

# Lang install
sh ./demo/admin/intl-update.sh
sh ./demo/site/intl-update.sh

# Build the packages CLI and eslint-plugin to be used for dev startup
pnpm --filter '@comet/cli' --filter '@comet/eslint-plugin' run build