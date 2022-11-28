const waitForPackages = require("./waitForPackages");

module.exports = {
    apps: [
        {
            name: "comet-demo-docker",
            script: "node docker-compose.js",
            namespace: "comet-cms",
            kill_timeout: 30000,
        },
        {
            name: "comet-demo-api",
            script: [
                waitForPackages("@comet/blocks-api", "@comet/cms-api"),
                "npx wait-on -l tcp:$POSTGRESQL_PORT tcp:$IMGPROXY_PORT",
                "npx yarn workspace comet-demo-api db:migrate",
                "npx yarn workspace comet-demo-api start:dev",
            ].join(" && "),
            namespace: "comet-cms",
            autorestart: true,
        },
        {
            name: "comet-demo-idp",
            script: "node mock-idp.js",
            namespace: "comet-cms",
            autorestart: true,
        },
    ],
};
