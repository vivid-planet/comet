const packageFolderMapping = {
    "@comet/admin": "packages/admin/admin",
    "@comet/admin-color-picker": "packages/admin/admin-color-picker",
    "@comet/admin-date-time": "packages/admin/admin-date-time",
    "@comet/admin-icons": "packages/admin/admin-icons",
    "@comet/admin-react-select": "packages/admin/admin-react-select",
    "@comet/admin-rte": "packages/admin/admin-rte",
    "@comet/admin-theme": "packages/admin/admin-theme",
    "@comet/blocks-admin": "packages/admin/blocks-admin",
    "@comet/cms-admin": "packages/admin/cms-admin",
    "@comet/blocks-api": "packages/api/blocks-api",
    "@comet/cms-api": "packages/api/cms-api",
    "@comet/cms-site": "packages/site/cms-site",
};

const waitForPackages = (...packages) => {
    return "npx wait-on -l " + packages.map((package) => `${packageFolderMapping[package]}/lib/index.d.ts`).join(" ");
};

module.exports = {
    apps: [
        {
            name: "comet-admin",
            script: [waitForPackages("@comet/admin-icons"), "npx yarn workspace @comet/admin start"].join(" && "),
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-color-picker",
            script: [waitForPackages("@comet/admin"), "npx yarn workspace @comet/admin-color-picker start"].join(" && "),
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-date-time",
            script: [waitForPackages("@comet/admin-icons", "@comet/admin"), "npx yarn workspace @comet/admin-date-time start"].join(" && "),
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-icons",
            script: "npx yarn workspace @comet/admin-icons start",
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-react-select",
            script: [waitForPackages("@comet/admin"), "npx yarn workspace @comet/admin-react-select start"].join(" && "),
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-rte",
            script: "npx yarn workspace @comet/admin-rte start",
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-stories",
            script: [
                waitForPackages(
                    "@comet/admin-icons",
                    "@comet/admin-rte",
                    "@comet/admin",
                    "@comet/admin-color-picker",
                    "@comet/admin-react-select",
                    "@comet/admin-theme",
                ),
                "npx yarn workspace comet-admin-stories storybook",
            ].join(" && "),
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-theme",
            script: [
                waitForPackages("@comet/admin-icons", "@comet/admin-rte", "@comet/admin", "@comet/admin-color-picker", "@comet/admin-react-select"),
                "npx yarn workspace @comet/admin-theme start",
            ].join(" && "),
            namespace: "comet-admin",
            autorestart: true,
        },
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
        {
            name: "comet-blocks-api",
            script: "npx yarn workspace @comet/blocks-api dev",
            namespace: "comet-cms",
            autorestart: true,
        },
        {
            name: "comet-blocks-api-codegen-block-meta",
            script: "npx yarn workspace @comet/blocks-api generate-block-meta:watch",
            namespace: "comet-cms",
            autorestart: true,
        },
        {
            name: "comet-cms-api",
            script: [waitForPackages("@comet/blocks-api"), "npx yarn workspace @comet/cms-api dev"].join(" && "),
            namespace: "comet-cms",
            autorestart: true,
        },
        {
            name: "comet-cms-api-codegen-schema",
            script: [waitForPackages("@comet/blocks-api"), "npx yarn workspace @comet/cms-api generate-schema:watch"].join(" && "),
            namespace: "comet-cms",
            autorestart: true,
        },
        {
            name: "comet-cms-api-codegen-block-meta",
            script: [waitForPackages("@comet/blocks-api"), "npx yarn workspace @comet/cms-api generate-block-meta:watch"].join(" && "),
            namespace: "comet-cms",
            autorestart: true,
        },

        {
            name: "comet-cms-site",
            script: "npx yarn workspace @comet/cms-site dev",
            namespace: "comet-cms",
            autorestart: true,
        },
        {
            name: "comet-cms-site-codegen-block-types",
            script: "npx yarn workspace @comet/cms-site generate-block-types:watch",
            namespace: "comet-cms",
            autorestart: true,
        },
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
        {
            name: "comet-demo-site",
            script: [waitForPackages("@comet/cms-site"), "npx wait-on -l tcp:$API_PORT", "npx yarn workspace comet-demo-site dev"].join(" && "),
            namespace: "comet-cms",
            autorestart: true,
        },
        {
            name: "comet-demo-site-codegen",
            script: ["npx wait-on -l tcp:$API_PORT", "npx yarn workspace comet-demo-site gql:watch"].join(" && "),
            namespace: "comet-cms",
            autorestart: true,
        },
        {
            name: "comet-demo-site-block-codegen",
            script: ["npx wait-on -l tcp:$API_PORT", "npx yarn workspace comet-demo-site generate-block-types:watch"].join(" && "),
            namespace: "comet-cms",
            autorestart: true,
        },
        {
            name: "comet-demo-proxy",
            script: "node proxy.js",
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
