#!/usr/bin/env bash
. ~/.nvm/nvm.sh

# jump into project dir
cd $(dirname $0)

# use correct npm and install dependencies
nvm install
nvm use
npm i -g npm@7.19 yarn
yarn install

# admin Blocks
ln -sf ../../api/blocks-api/block-meta.json ./packages/admin/blocks-admin/block-meta.json

# admin CMS
ln -sf ../../api/cms-api/schema.gql ./packages/admin/cms-admin/schema.gql
ln -sf ../../api/cms-api/block-meta.json ./packages/admin/cms-admin/block-meta.json

# site CMS
ln -sf ../../api/cms-api/block-meta.json ./packages/site/cms-site/block-meta.json
