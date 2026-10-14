FROM node:24-bookworm

RUN corepack enable

WORKDIR /app
COPY . .

# CI=true makes copy-project-files copy instead of symlink and skip the local .env files
ENV CI=true
RUN pnpm install --frozen-lockfile --filter root --filter "dextinity-demo-api..."
RUN node copy-project-files.js
RUN pnpm --filter "dextinity-demo-api^..." run build
RUN sh demo/api/intl-update.sh
RUN pnpm --filter dextinity-demo-api run build

WORKDIR /app/demo/api
ENV NODE_ENV=production
EXPOSE 4000
CMD ["sh", "-c", "node dist/console.js migrate && node dist/main"]
