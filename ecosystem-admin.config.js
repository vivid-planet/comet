const waitForPackages = require("./waitForPackages");

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
            name: "comet-admin-theme",
            script: [
                waitForPackages("@comet/admin-icons", "@comet/admin-rte", "@comet/admin", "@comet/admin-color-picker", "@comet/admin-react-select"),
                "npx yarn workspace @comet/admin-theme start",
            ].join(" && "),
            namespace: "comet-admin",
            autorestart: true,
        },
    ],
};
