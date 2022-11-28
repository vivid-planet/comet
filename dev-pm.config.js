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
            script: "npx yarn workspace @comet/admin start",
            group: ["comet-admin"],
            waitOn: waitOnPackages("@comet/admin-icons")
        },
        {
            name: "comet-admin-color-picker",
            script: "npx yarn workspace @comet/admin-color-picker start",
            group: ["comet-admin"],
            waitOn: waitOnPackages("@comet/admin")
        },
        {
            name: "comet-admin-date-time",
            script: "npx yarn workspace @comet/admin-date-time start",
            group: ["comet-admin"],
            waitOn: waitOnPackages("@comet/admin-icons", "@comet/admin")
        },
        {
            name: "comet-admin-icons",
            script: "npx yarn workspace @comet/admin-icons start",
            group: ["comet-admin"]
        },
        {
            name: "comet-admin-react-select",
            script: "npx yarn workspace @comet/admin-react-select start",
            group: ["comet-admin"],
            waitOn: waitOnPackages("@comet/admin")
        },
        {
            name: "comet-admin-rte",
            script: "npx yarn workspace @comet/admin-rte start",
            group: ["comet-admin"]
        },
        {
            name: "comet-admin-theme",
            script: "npx yarn workspace @comet/admin-theme start",
            group: ["comet-admin"],
            waitOn: waitOnPackages("@comet/admin-icons", "@comet/admin-rte", "@comet/admin", "@comet/admin-color-picker", "@comet/admin-react-select")
        },

        // group cms-admin
        {
            name: "blocks-admin",
            script: "npx yarn workspace @comet/blocks-admin start",
            group: ["cms-admin", "cms"],
            waitOn: waitOnPackages("@comet/admin", "@comet/admin-icons")
        },
        {
            name: "blocks-admin-codegen-block-types",
            script: "npx yarn workspace @comet/blocks-admin generate-block-types:watch",
            group: ["cms-admin", "cms"],
            waitOn: waitOnPackages("@comet/admin", "@comet/admin-icons")
        },
        {
            name: "cms-admin",
            script: "npx yarn workspace @comet/cms-admin start",
            group: ["cms-admin", "cms"],
            waitOn: waitOnPackages(
                "@comet/admin",
                "@comet/admin-icons",
                "@comet/admin-react-select",
                "@comet/admin-rte",
                "@comet/admin-theme",
                "@comet/blocks-admin"
            )
        },
        {
            name: "cms-admin-codegen-graphql-types",
            script: "npx yarn workspace @comet/cms-admin generate-graphql-types:watch",
            group: ["cms-admin", "cms"],
            waitOn: waitOnPackages(
                "@comet/admin",
                "@comet/admin-icons",
                "@comet/admin-react-select",
                "@comet/admin-rte",
                "@comet/admin-theme",
                "@comet/blocks-admin"
            )
        },
        {
            name: "cms-admin-codegen-block-types",
            script: "npx yarn workspace @comet/cms-admin generate-block-types:watch",
            group: ["cms-admin", "cms"],
            waitOn: waitOnPackages(
                "@comet/admin",
                "@comet/admin-icons",
                "@comet/admin-react-select",
                "@comet/admin-rte",
                "@comet/admin-theme",
                "@comet/blocks-admin"
            )
        },
    
        //group cms-api
        {
            name: "blocks-api",
            script: "npx yarn workspace @comet/blocks-api dev",
            group: ["cms-api", "cms"]
        },
        {
            name: "blocks-api-codegen-block-meta",
            script: "npx yarn workspace @comet/blocks-api generate-block-meta:watch",
            group: ["cms-api", "cms"]
        },
        {
            name: "cms-api",
            script: "npx yarn workspace @comet/cms-api dev",
            group: ["cms-api", "cms"],
            waitOn: waitOnPackages("@comet/blocks-api")
        },
        {
            name: "cms-api-codegen-schema",
            script: "npx yarn workspace @comet/cms-api generate-schema:watch",
            group: ["cms-api", "cms"],
            waitOn: waitOnPackages("@comet/blocks-api")
        },
        {
            name: "cms-api-codegen-block-meta",
            script: "npx yarn workspace @comet/cms-api generate-block-meta:watch",
            group: ["cms-api", "cms"],
            waitOn: waitOnPackages("@comet/blocks-api")
        },

        //group cms-site
        {
            name: "cms-site",
            script: "npx yarn workspace @comet/cms-site dev",
            group: ["cms-site", "cms"]
        },
        {
            name: "cms-site-codegen-block-types",
            script: "npx yarn workspace @comet/cms-site generate-block-types:watch",
            group: ["cms-site", "cms"]
        },

        //group demo admin
        {
            name: "demo-admin",
            script: "npx yarn workspace comet-demo-admin start",
            group: ["demo-admin", "demo"],
            waitOn: [
                ...waitOnPackages("@comet/admin",
                    "@comet/admin-icons",
                    "@comet/admin-react-select",
                    "@comet/admin-rte",
                    "@comet/admin-theme",
                    "@comet/blocks-admin",
                    "@comet/cms-admin"
                ),
                "tcp:$API_PORT"
            ]
        },
        {
            name: "demo-admin-codegen",
            script: "npx yarn workspace comet-demo-admin gql:watch",
            group: ["demo-admin", "demo"],
            waitOn: [
                "tcp:$API_PORT"
            ]
        },
        {
            name: "demo-admin-block-codegen",
            script: "npx yarn workspace comet-demo-admin generate-block-types:watch",
            group: ["demo-admin", "demo"],
            waitOn: [
                "tcp:$API_PORT"
            ]
        },


        //group demo api
        {
            name: "demo-docker",
            script: "node docker-compose.js",
            group: ["demo-api", "demo"]
        },
        {
            name: "demo-api",
            script: [
                "npx yarn workspace comet-demo-api db:migrate",
                "npx yarn workspace comet-demo-api start:dev",
            ].join(" && "),
            group: ["demo-api", "demo"],
            waitOn: [
                ...waitOnPackages("@comet/blocks-api", "@comet/cms-api"),
                "tcp:$POSTGRESQL_PORT",
                "tcp:$IMGPROXY_PORT"
            ]
        },
        {
            name: "demo-proxy",
            script: "node proxy.js",
            group: ["demo-api", "demo"]
        },
        {
            name: "demo-idp",
            script: "node mock-idp.js",
            group: ["demo-api", "demo"]
        },

        //group demo site
        {
            name: "demo-site",
            script: "npx yarn workspace comet-demo-site dev",
            group: ["demo-site", "demo"],
            waitOn: [
                ...waitOnPackages("@comet/cms-site"),
                "tcp:$API_PORT",
            ]
        },
        {
            name: "demo-site-codegen",
            script: "npx yarn workspace comet-demo-site gql:watch",
            group: ["demo-site", "demo"],
            waitOn: [
                "tcp:$API_PORT",
            ]
        },
        {
            name: "demo-site-block-codegen",
            script: "npx yarn workspace comet-demo-site generate-block-types:watch",
            group: ["demo-site", "demo"],
            waitOn: [
                "tcp:$API_PORT",
            ]
        },
    ],
};
