const waitForPackages = require("./waitForPackages");

module.exports = {
    apps: [
        {
            name: "comet-demo-admin",
            script: [
                waitForPackages(
                    "@comet/admin",
                    "@comet/admin-icons",
                    "@comet/admin-react-select",
                    "@comet/admin-rte",
                    "@comet/admin-theme",
                    "@comet/blocks-admin",
                    "@comet/cms-admin",
                ),
                "npx wait-on -l tcp:$API_PORT",
                "npx yarn workspace comet-demo-admin start",
            ].join(" && "),
            namespace: "comet-cms",
            autorestart: true,
        },
        {
            name: "comet-demo-admin-codegen",
            script: ["npx wait-on -l tcp:$API_PORT", "npx yarn workspace comet-demo-admin gql:watch"].join(" && "),
            namespace: "comet-cms",
            autorestart: true,
        },
        {
            name: "comet-demo-admin-block-codegen",
            script: ["npx wait-on -l tcp:$API_PORT", "npx yarn workspace comet-demo-admin generate-block-types:watch"].join(" && "),
            namespace: "comet-cms",
            autorestart: true,
        },
    ],
};
