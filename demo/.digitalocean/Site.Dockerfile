FROM registry.access.redhat.com/ubi10/nodejs-24:latest

USER 1001

COPY --chown=1001:0 ./ ./

# The demo depends on the packages in this repository, so they're built before the demo itself.
# CI=true makes copy-project-files copy instead of symlink and skip the local .env files.
# Next.js loads the contact form route while building, which requires the mailer, contact form and reCAPTCHA variables. They're read again at runtime.
RUN npm install --global --prefix "$HOME/.local" "$(node -p 'require("./package.json").packageManager')" && \
    export PATH="$HOME/.local/bin:$PATH" CI=true && \
    pnpm install --frozen-lockfile --filter root --filter "dextinity-demo-site..." && \
    node copy-project-files.js && \
    pnpm --filter "dextinity-demo-site^..." run build && \
    ./demo/site/intl-update.sh && \
    MAILER_HOST=build MAILER_PORT=25 CONTACT_FORM_FROM_EMAIL=build@example.com CONTACT_FORM_TO_EMAIL=build@example.com \
        RECAPTCHA_SERVICE_ACCOUNT=eyJwcm9qZWN0X2lkIjoiYnVpbGQifQ== \
        pnpm --filter dextinity-demo-site run build

WORKDIR ./demo/site

CMD "node" "dist/server"
