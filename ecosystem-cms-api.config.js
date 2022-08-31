const waitForPackages = require("./waitForPackages");

module.exports = {
    apps: [
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
    ],
};
