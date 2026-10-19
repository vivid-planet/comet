# syntax=docker/dockerfile:1

# The dev OpenID Connect provider of local development (see dev-oidc-provider.config.mts), which
# offers the users of demo/api/src/auth/static-users.ts on its login page.
FROM mirror.gcr.io/library/node:24-bookworm

ENV CI=true HUSKY=0 COREPACK_ENABLE_DOWNLOAD_PROMPT=0
# Everything after corepack enable, which writes next to the node binary, runs as the unprivileged
# node user of the base image, during the build and at runtime. WORKDIR would create the directory
# as root, so it is created and handed over first.
RUN corepack enable && mkdir -p /app && chown node:node /app
WORKDIR /app
USER node

COPY --chown=node:node --parents package.json pnpm-lock.yaml pnpm-workspace.yaml packages/**/package.json demo/**/package.json docs/package.json storybook/package.json ./
# uid/gid: a cache mount is created for root unless it is told otherwise, and pnpm could not write it.
RUN --mount=type=cache,id=dextinity-demo-deploy-preview-pnpm-store,target=/pnpm-store,uid=1000,gid=1000 \
    pnpm install --frozen-lockfile --store-dir /pnpm-store --filter=.

COPY --chown=node:node --parents dev-oidc-provider.config.mts demo/api/src/auth/static-users.ts ./

EXPOSE 8080
CMD ["node_modules/.bin/dev-oidc-provider"]
