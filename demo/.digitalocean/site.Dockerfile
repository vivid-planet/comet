FROM node:24-bookworm

RUN corepack enable

WORKDIR /app
COPY . .

# CI=true makes copy-project-files copy instead of symlink and skip the local .env files
ENV CI=true
RUN pnpm install --frozen-lockfile --filter root --filter "dextinity-demo-site..."
RUN node copy-project-files.js
RUN pnpm --filter "dextinity-demo-site^..." run build
RUN sh demo/site/intl-update.sh
# Next.js loads the contact form route while building, which requires these variables. They're read again at runtime.
RUN MAILER_HOST=build MAILER_PORT=25 CONTACT_FORM_FROM_EMAIL=build@example.com CONTACT_FORM_TO_EMAIL=build@example.com \
    RECAPTCHA_SERVICE_ACCOUNT=eyJwcm9qZWN0X2lkIjoiYnVpbGQifQ== \
    pnpm --filter dextinity-demo-site run build

WORKDIR /app/demo/site
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/server.js"]
