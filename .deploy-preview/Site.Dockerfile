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
    pnpm install --frozen-lockfile --store-dir /pnpm-store --filter='dextinity-demo-site...'

COPY --chown=node:node . .
# CI=true makes copy-project-files.js copy instead of symlink, and skip the .env files: the
# configuration is injected by docker-compose.yml.
RUN node copy-project-files.js && sh demo/site/intl-update.sh
RUN pnpm --recursive --filter='dextinity-demo-site^...' run build

WORKDIR /app/demo/site
# Next.js evaluates the route modules while building, which read their configuration from the
# environment. The build therefore gets the development defaults from the checked-in .env, which is
# deleted again right after, so that at runtime only what docker-compose.yml injects is in effect.
# The contact form and the reCAPTCHA client fail without values that .env leaves empty, so the build
# gets placeholders; at runtime they are only used when a form is submitted. The cache handler is
# disabled, because Valkey is not reachable while building.
# BuildKit creates the parent of a cache mount as root, so .next has to exist beforehand - next
# writes .next/trace next to the mounted cache.
RUN mkdir -p .next
RUN --mount=type=cache,id=dextinity-demo-deploy-preview-next-cache,target=/app/demo/site/.next/cache,uid=1000,gid=1000 \
    cp ../../.env .env \
    && NODE_OPTIONS=--max-old-space-size=4096 \
    CONTACT_FORM_FROM_EMAIL=placeholder@example.com \
    CONTACT_FORM_TO_EMAIL=placeholder@example.com \
    RECAPTCHA_SERVICE_ACCOUNT="$(echo '{"project_id":"placeholder"}' | base64)" \
    VALKEY_ENABLED=false \
    pnpm run build \
    && rm .env

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/server.js"]
