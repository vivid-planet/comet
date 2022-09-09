module.exports = {
    apps: [
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
    ],
};
