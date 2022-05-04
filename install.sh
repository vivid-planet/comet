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
ln -sf ../../api/api-blocks/block-meta.json ./packages/admin/admin-blocks/block-meta.json

# admin CMS
ln -sf ../../api/api-cms/schema.gql ./packages/admin/admin-cms/schema.gql
ln -sf ../../api/api-cms/block-meta.json ./packages/admin/admin-cms/block-meta.json

# site CMS
ln -sf ../../api/api-cms/block-meta.json ./packages/site/site-cms/block-meta.json

# api DEMO
ln -sf ../../.env ./demo/api/.env

# admin DEMO
ln -sf ../../.env ./demo/admin/.env
ln -sf ../api/schema.gql ./demo/admin/schema.gql
ln -sf ../api/block-meta.json ./demo/admin/block-meta.json

# site DEMO
ln -sf ../../.env ./demo/site/.env
ln -sf ../api/schema.gql ./demo/site/schema.gql
ln -sf ../api/block-meta.json ./demo/site/block-meta.json
