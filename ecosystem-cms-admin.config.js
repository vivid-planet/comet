const waitForPackages = require("./waitForPackages");

module.exports = {
    apps: [
        {
            name: "comet-blocks-admin",
            script: [waitForPackages("@comet/admin", "@comet/admin-icons"), "npx yarn workspace @comet/blocks-admin start"].join(" && "),
            namespace: "comet-cms",
            autorestart: true,
        },
        {
            name: "comet-blocks-admin-codegen-block-types",
            script: [waitForPackages("@comet/admin", "@comet/admin-icons"), "npx yarn workspace @comet/blocks-admin generate-block-types:watch"].join(
                " && ",
            ),
            namespace: "comet-cms",
            autorestart: true,
        },
        {
            name: "comet-cms-admin",
            script: [
                waitForPackages(
                    "@comet/admin",
                    "@comet/admin-icons",
                    "@comet/admin-react-select",
                    "@comet/admin-rte",
                    "@comet/admin-theme",
                    "@comet/blocks-admin",
                ),
                "npx yarn workspace @comet/cms-admin start",
            ].join(" && "),
            namespace: "comet-cms",
            autorestart: true,
        },
        {
            name: "comet-cms-admin-codegen-graphql-types",
            script: [
                waitForPackages(
                    "@comet/admin",
                    "@comet/admin-icons",
                    "@comet/admin-react-select",
                    "@comet/admin-rte",
                    "@comet/admin-theme",
                    "@comet/blocks-admin",
                ),
                "npx yarn workspace @comet/cms-admin generate-graphql-types:watch",
            ].join(" && "),
            namespace: "comet-cms",
            autorestart: true,
        },
        {
            name: "comet-cms-admin-codegen-block-types",
            script: [
                waitForPackages(
                    "@comet/admin",
                    "@comet/admin-icons",
                    "@comet/admin-react-select",
                    "@comet/admin-rte",
                    "@comet/admin-theme",
                    "@comet/blocks-admin",
                ),
                "npx yarn workspace @comet/cms-admin generate-block-types:watch",
            ].join(" && "),
            namespace: "comet-cms",
            autorestart: true,
        },
    ],
};
