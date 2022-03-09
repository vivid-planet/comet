#!/usr/bin/env bash
. ~/.nvm/nvm.sh

# jump into project dir
cd $(dirname $0)

# use correct npm and install dependencies
nvm install
nvm use
npm i -g yarn npm@7.19
yarn install

# CMS Admin
ln -sf ../../api/api-cms/schema.gql ./packages/admin/admin-cms/schema.gql
ln -sf ../../api/api-cms/block-meta.json ./packages/admin/admin-cms/block-meta.json

# Blocks Admin
ln -sf ../../api/api-blocks/block-meta.json ./packages/admin/admin-blocks/block-meta.json

# CMS Site
ln -sf ../../api/api-cms/block-meta.json ./packages/site/site-cms/block-meta.json

# create admin symlinks
ln -sf ../../.env ./demo/admin/.env
ln -sf ../api/schema.gql ./demo/admin/schema.gql
ln -sf ../api/block-meta.json ./demo/admin/block-meta.json

# create api symlinks
ln -sf ../../.env ./demo/api/.env

# create site symlinks
ln -sf ../../.env ./demo/site/.env
ln -sf ../api/schema.gql ./demo/site/schema.gql
ln -sf ../api/block-meta.json ./demo/site/block-meta.json

# create webstorm/phpstorm symlink
ln -sf ./demo/api/schema.gql ./schema.graphql

yarn workspace comet-demo-admin init-idp
npm --prefix demo/admin/server install

#mkdir -p ./api/uploads
