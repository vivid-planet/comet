import { defineConfig } from "@comet/dev-process-manager";

const packageFolderMapping = {
    "@comet/admin": "packages/admin/admin",
    "@comet/admin-color-picker": "packages/admin/admin-color-picker",
    "@comet/admin-date-time": "packages/admin/admin-date-time",
    "@comet/admin-icons": "packages/admin/admin-icons",
    "@comet/admin-rte": "packages/admin/admin-rte",
    "@comet/cms-admin": "packages/admin/cms-admin",
    "@comet/cms-api": "packages/api/cms-api",
    "@comet/site-nextjs": "packages/site/site-nextjs",
    "@comet/site-react": "packages/site/site-react",
};

const waitOnPackages = (...packages: (keyof typeof packageFolderMapping)[]) => {
    return packages.map((packageName) => `${packageFolderMapping[packageName]}/lib/index.d.ts`);
};

export default defineConfig({
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
            name: "comet-admin-rte",
            script: "pnpm --filter @comet/admin-rte run start",
            group: ["comet-admin"],
        },

        // admin-generator
        {
            name: "admin-generator",
            script: "pnpm --filter @comet/admin-generator run dev",
            group: ["cms-admin", "cms"],
            waitOn: waitOnPackages("@comet/cms-admin"),
        },

        // group cms-admin
        {
            name: "cms-admin",
            script: "pnpm --filter @comet/cms-admin run start",
            group: ["cms-admin", "cms"],
            waitOn: waitOnPackages("@comet/admin", "@comet/admin-icons", "@comet/admin-rte"),
        },
        {
            name: "cms-admin-codegen-graphql-types",
            script: "pnpm --filter @comet/cms-admin run gql:watch",
            group: ["cms-admin", "cms"],
            waitOn: waitOnPackages("@comet/admin", "@comet/admin-icons", "@comet/admin-rte"),
        },
        {
            name: "cms-admin-codegen-block-types",
            script: "pnpm --filter @comet/cms-admin run generate-block-types:watch",
            group: ["cms-admin", "cms"],
            waitOn: waitOnPackages("@comet/admin", "@comet/admin-icons", "@comet/admin-rte"),
        },

        //group cms-api
        {
            name: "cms-api",
            script: "pnpm --filter @comet/cms-api run dev",
            group: ["cms-api", "cms"],
        },
        {
            name: "cms-api-codegen-schema",
            script: "pnpm --filter @comet/cms-api run generate-schema:watch",
            group: ["cms-api", "cms"],
        },
        {
            name: "cms-api-codegen-block-meta",
            script: "pnpm --filter @comet/cms-api run generate-block-meta:watch",
            group: ["cms-api", "cms"],
        },
        // api-generator
        {
            name: "api-generator",
            script: "pnpm --filter @comet/api-generator run dev",
            group: ["cms-api", "cms"],
            waitOn: waitOnPackages("@comet/cms-api"),
        },

        //group site-nextjs
        {
            name: "site-nextjs",
            script: "pnpm --filter @comet/site-nextjs run dev",
            group: ["site-nextjs", "cms"],
            waitOn: [...waitOnPackages("@comet/site-react")],
        },
        {
            name: "site-nextjs-codegen-block-types",
            script: "pnpm --filter @comet/site-nextjs run generate-block-types:watch",
            group: ["site-nextjs", "cms"],
            waitOn: [...waitOnPackages("@comet/site-react")],
        },

        //group site-react
        {
            name: "site-react",
            script: "pnpm --filter @comet/site-react run dev",
            group: ["site-react", "site-nextjs", "cms"],
        },
        {
            name: "site-react-codegen-block-types",
            script: "pnpm --filter @comet/site-react run generate-block-types:watch",
            group: ["site-react", "site-nextjs", "cms"],
        },

        //group demo admin
        {
            name: "demo-admin",
            script: "pnpm --filter comet-demo-admin run start",
            group: ["demo-admin", "demo"],
            waitOn: [...waitOnPackages("@comet/admin", "@comet/admin-icons", "@comet/admin-rte", "@comet/cms-admin"), "tcp:$API_PORT"],
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
            script: "docker compose up",
            group: ["demo-api", "demo"],
        },
        {
            name: "demo-api-generator",
            script: "pnpm --filter comet-demo-api exec comet-api-generator generate --watch",
            group: ["demo-api", "demo"],
            waitOn: [...waitOnPackages("@comet/cms-api"), "packages/api/api-generator/lib/apiGenerator.js"],
        },
        {
            name: "demo-api",
            script: "pnpm --filter comet-demo-api run start:dev",
            group: ["demo-api", "demo"],
            waitOn: [...waitOnPackages("@comet/cms-api"), "tcp:$POSTGRESQL_PORT", "tcp:$IMGPROXY_PORT"],
        },
        {
            name: "demo-api-mitmproxy",
            script: "pnpm run dev:demo-api-mitmproxy",
            group: ["demo-api", "demo"],
            waitOn: ["tcp:$API_PORT"],
        },

        // group demo login
        {
            name: "demo-oidc-provider",
            script: "pnpm run dev:oidc-provider",
            group: ["demo-login", "demo"],
        },
        {
            name: "demo-oauth2-proxy",
            script: "pnpm run dev:oauth2-proxy",
            group: ["demo-login", "demo"],
            waitOn: ["tcp:$IDP_PORT", "tcp:$ADMIN_PORT"],
        },

        //group demo site
        {
            name: "demo-site",
            script: "pnpm --filter comet-demo-site run dev",
            group: ["demo-site", "demo"],
            waitOn: [...waitOnPackages("@comet/site-nextjs"), "tcp:$API_PORT"],
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
        {
            name: "demo-site-css-types",
            script: "pnpm --filter comet-demo-site run css:types:watch",
            group: ["demo-site", "demo"],
        },

        // group docs
        {
            name: "storybook",
            script: "pnpm --filter comet-storybook run storybook",
            group: ["storybook", "docs"],
        },
        {
            name: "docs",
            script: "pnpm --filter comet-docs start",
            group: ["docs"],
            waitOn: ["tcp:26638"], // storybook
        },
        {
            name: "storybook-comet-admin",
            script: "pnpm --filter @comet/admin run storybook",
            group: ["storybook"],
            waitOn: waitOnPackages("@comet/admin"),
        },
    ],
});
