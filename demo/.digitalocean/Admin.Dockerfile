FROM registry.access.redhat.com/ubi10/nodejs-24:latest

USER 1001

COPY --chown=1001:0 ./ ./

# The demo depends on the packages in this repository, so they're built before the demo itself.
# CI=true makes copy-project-files copy instead of symlink and skip the local .env files.
RUN npm install --global --prefix "$HOME/.local" "$(node -p 'require("./package.json").packageManager')" && \
    export PATH="$HOME/.local/bin:$PATH" CI=true && \
    pnpm install --frozen-lockfile --filter root --filter "dextinity-demo-admin..." --filter dextinity-demo-admin-server && \
    node copy-project-files.js && \
    pnpm --filter "dextinity-demo-admin^..." run build && \
    ./demo/admin/intl-update.sh && \
    pnpm --filter dextinity-demo-admin run build

WORKDIR ./demo/admin

CMD "node" "server"
