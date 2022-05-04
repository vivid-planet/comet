const waitForLib = (folders) => {
    if (!Array.isArray(folders)) folders = [folders];
    return "npx wait-on -l " + folders.map((folder) => `packages/admin/${folder}/lib/index.d.ts`).join(" ");
};

module.exports = {
    apps: [
        {
            name: "comet-admin-icons",
            script: "npx yarn workspace @comet/admin-icons start",
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
            name: "comet-admin",
            script: [waitForLib("admin-icons"), "npx yarn workspace @comet/admin start"].join(" && "),
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-color-picker",
            script: [waitForLib("admin"), "npx yarn workspace @comet/admin-color-picker start"].join(" && "),
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-date-time",
            script: [waitForLib(["admin-icons", "admin"]), "npx yarn workspace @comet/admin-date-time start"].join(" && "),
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-react-select",
            script: [waitForLib("admin"), "npx yarn workspace @comet/admin-react-select start"].join(" && "),
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-theme",
            script: [
                waitForLib(["admin-icons", "admin-rte", "admin", "admin-color-picker", "admin-react-select"]),
                "npx yarn workspace @comet/admin-theme start",
            ].join(" && "),
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-storybook",
            script: [
                waitForLib(["admin-icons", "admin-rte", "admin", "admin-color-picker", "admin-react-select", "admin-theme"]),
                "npx yarn workspace comet-admin-stories storybook",
            ].join(" && "),
            namespace: "comet-admin",
            autorestart: true,
        },
    ],
};
