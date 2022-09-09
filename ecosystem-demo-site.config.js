const waitForPackages = require("./waitForPackages");

module.exports = {
    apps: [
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
    ],
};
