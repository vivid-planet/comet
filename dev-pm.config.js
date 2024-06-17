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

const waitOnPackages = (...packages) => {
    return packages.map((package) => `${packageFolderMapping[package]}/lib/index.d.ts`);
};

module.exports = {
    scripts: [
        // group admin
        {
            name: "comet-admin",
            script: "pnpm --filter @comet/admin run start",
            group: ["comet-admin"],
            waitOn: waitOnPackages("@comet/admin-icons"),
        },
        {
            name: "comet-admin-color-picker",
            script: "pnpm --filter @comet/admin-color-picker run start",
            group: ["comet-admin"],
            waitOn: waitOnPackages("@comet/admin"),
        },
        {
            name: "comet-admin-date-time",
            script: "pnpm --filter @comet/admin-date-time run start",
            group: ["comet-admin"],
            waitOn: waitOnPackages("@comet/admin-icons", "@comet/admin"),
        },
        {
            name: "comet-admin-icons",
            script: "pnpm --filter @comet/admin-icons run start",
            group: ["comet-admin"],
        },
        {
            name: "comet-admin-react-select",
            script: "pnpm --filter @comet/admin-react-select run start",
            group: ["comet-admin"],
            waitOn: waitOnPackages("@comet/admin"),
        },
        {
            name: "comet-admin-rte",
            script: "pnpm --filter @comet/admin-rte run start",
            group: ["comet-admin"],
        },
        {
            name: "comet-admin-theme",
            script: "pnpm --filter @comet/admin-theme run start",
            group: ["comet-admin"],
            waitOn: waitOnPackages(
                "@comet/admin-icons",
                "@comet/admin-rte",
                "@comet/admin",
                "@comet/admin-color-picker",
                "@comet/admin-react-select",
            ),
        },

        // group cms-admin
        {
            name: "blocks-admin",
            script: "pnpm --filter @comet/blocks-admin run start",
            group: ["cms-admin", "cms"],
            waitOn: waitOnPackages("@comet/admin", "@comet/admin-icons"),
        },
        {
            name: "blocks-admin-codegen-block-types",
            script: "pnpm --filter @comet/blocks-admin run generate-block-types:watch",
            group: ["cms-admin", "cms"],
            waitOn: waitOnPackages("@comet/admin", "@comet/admin-icons"),
        },
        {
            name: "cms-admin",
            script: "pnpm --filter @comet/cms-admin run start",
            group: ["cms-admin", "cms"],
            waitOn: waitOnPackages(
                "@comet/admin",
                "@comet/admin-icons",
                "@comet/admin-react-select",
                "@comet/admin-rte",
                "@comet/admin-theme",
                "@comet/blocks-admin",
            ),
        },
        {
            name: "cms-admin-codegen-graphql-types",
            script: "pnpm --filter @comet/cms-admin run generate-graphql-types:watch",
            group: ["cms-admin", "cms"],
            waitOn: waitOnPackages(
                "@comet/admin",
                "@comet/admin-icons",
                "@comet/admin-react-select",
                "@comet/admin-rte",
                "@comet/admin-theme",
                "@comet/blocks-admin",
            ),
        },
        {
            name: "cms-admin-codegen-block-types",
            script: "pnpm --filter @comet/cms-admin run generate-block-types:watch",
            group: ["cms-admin", "cms"],
            waitOn: waitOnPackages(
                "@comet/admin",
                "@comet/admin-icons",
                "@comet/admin-react-select",
                "@comet/admin-rte",
                "@comet/admin-theme",
                "@comet/blocks-admin",
            ),
        },

        //group cms-api
        {
            name: "blocks-api",
            script: "pnpm --filter @comet/blocks-api run dev",
            group: ["cms-api", "cms"],
        },
        {
            name: "blocks-api-codegen-block-meta",
            script: "pnpm --filter @comet/blocks-api run generate-block-meta:watch",
            group: ["cms-api", "cms"],
        },
        {
            name: "cms-api",
            script: "pnpm --filter @comet/cms-api run dev",
            group: ["cms-api", "cms"],
            waitOn: waitOnPackages("@comet/blocks-api"),
        },
        {
            name: "cms-api-codegen-schema",
            script: "pnpm --filter @comet/cms-api run generate-schema:watch",
            group: ["cms-api", "cms"],
            waitOn: waitOnPackages("@comet/blocks-api"),
        },
        {
            name: "cms-api-codegen-block-meta",
            script: "pnpm --filter @comet/cms-api run generate-block-meta:watch",
            group: ["cms-api", "cms"],
            waitOn: waitOnPackages("@comet/blocks-api"),
        },

        //group cms-site
        {
            name: "cms-site",
            script: "pnpm --filter @comet/cms-site run dev",
            group: ["cms-site", "cms"],
        },
        {
            name: "cms-site-codegen-block-types",
            script: "pnpm --filter @comet/cms-site run generate-block-types:watch",
            group: ["cms-site", "cms"],
        },

        //group demo admin
        {
            name: "demo-admin",
            script: "pnpm --filter comet-demo-admin run start",
            group: ["demo-admin", "demo"],
            waitOn: [
                ...waitOnPackages(
                    "@comet/admin",
                    "@comet/admin-icons",
                    "@comet/admin-react-select",
                    "@comet/admin-rte",
                    "@comet/admin-theme",
                    "@comet/blocks-admin",
                    "@comet/cms-admin",
                ),
                "tcp:$API_PORT",
            ],
        },
        {
            name: "demo-admin-codegen",
            script: "pnpm --filter comet-demo-admin run gql:watch",
            group: ["demo-admin", "demo"],
            waitOn: ["tcp:$API_PORT"],
        },
        {
            name: "demo-admin-block-codegen",
            script: "pnpm --filter comet-demo-admin run generate-block-types:watch",
            group: ["demo-admin", "demo"],
            waitOn: ["tcp:$API_PORT"],
        },

        //group demo api
        {
            name: "demo-docker",
            script: "node docker-compose.js",
            group: ["demo-api", "demo"],
        },
        {
            name: "demo-api",
            script: ["pnpm --filter comet-demo-api run db:migrate", "pnpm --filter comet-demo-api run start:dev"].join(" && "),
            group: ["demo-api", "demo"],
            waitOn: [...waitOnPackages("@comet/blocks-api", "@comet/cms-api"), "tcp:$POSTGRESQL_PORT", "tcp:$IMGPROXY_PORT"],
        },

        //group demo site
        {
            name: "demo-site",
            script: "pnpm --filter comet-demo-site run dev",
            group: ["demo-site", "demo"],
            waitOn: [...waitOnPackages("@comet/cms-site"), "tcp:$API_PORT"],
        },
        {
            name: "demo-site-codegen",
            script: "pnpm --filter comet-demo-site run gql:watch",
            group: ["demo-site", "demo"],
            waitOn: ["tcp:$API_PORT"],
        },
        {
            name: "demo-site-block-codegen",
            script: "pnpm --filter comet-demo-site run generate-block-types:watch",
            group: ["demo-site", "demo"],
            waitOn: ["tcp:$API_PORT"],
        },

        //group demo site
        {
            name: "demo-site-pages",
            script: "pnpm --filter comet-demo-site-pages run dev",
            group: ["demo-site-pages", "demo"],
            waitOn: [...waitOnPackages("@comet/cms-site"), "tcp:$API_PORT"],
        },
        {
            name: "demo-site-pages-codegen",
            script: "pnpm --filter comet-demo-site-pages run gql:watch",
            group: ["demo-site-pages", "demo"],
            waitOn: ["tcp:$API_PORT"],
        },
        {
            name: "demo-site-pages-block-codegen",
            script: "pnpm --filter comet-demo-site-pages run generate-block-types:watch",
            group: ["demo-site-pages", "demo"],
            waitOn: ["tcp:$API_PORT"],
        },
    ],
};
