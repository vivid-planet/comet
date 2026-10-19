# syntax=docker/dockerfile:1

FROM mirror.gcr.io/library/node:24-bookworm

ENV CI=true HUSKY=0 COREPACK_ENABLE_DOWNLOAD_PROMPT=0
# Everything after corepack enable, which writes next to the node binary, runs as the unprivileged
# node user of the base image, during the build and at runtime. WORKDIR would create the directory
# as root, so it is created and handed over first.
RUN corepack enable && mkdir -p /app && chown node:node /app
WORKDIR /app
USER node

# The manifests are copied on their own, so that a source change does not invalidate the install.
COPY --chown=node:node --parents package.json pnpm-lock.yaml pnpm-workspace.yaml packages/**/package.json demo/**/package.json docs/package.json storybook/package.json ./
# uid/gid: a cache mount is created for root unless it is told otherwise, and pnpm could not write it.
RUN --mount=type=cache,id=dextinity-demo-deploy-preview-pnpm-store,target=/pnpm-store,uid=1000,gid=1000 \
    pnpm install --frozen-lockfile --store-dir /pnpm-store --filter='dextinity-demo-api...'

COPY --chown=node:node . .
# CI=true makes copy-project-files.js copy instead of symlink, and skip the .env files: the
# configuration is injected by docker-compose.yml.
RUN node copy-project-files.js && sh demo/api/intl-update.sh
RUN pnpm --recursive --filter='dextinity-demo-api^...' run build

WORKDIR /app/demo/api
RUN pnpm run build

# Blob storage of the api (FILE_STORAGE_PATH), shared with imgproxy through a volume. Created here,
# so that a fresh volume inherits the ownership of the node user.
RUN mkdir -p /app/demo/uploads

ENV NODE_ENV=production
EXPOSE 4000
CMD ["/app/.deploy-preview/api-start.sh"]
