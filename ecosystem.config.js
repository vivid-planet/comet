module.exports = {
    apps: [
        {
            name: "comet-admin",
            script: "npm run --prefix packages/admin start",
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-color-picker",
            script: "wait-on packages/admin/lib && npm run --prefix packages/admin-color-picker start",
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-date-time",
            script: "wait-on packages/admin/lib && npm run --prefix packages/admin-date-time start",
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-icons",
            script: "npm run --prefix packages/admin-icons start",
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-react-select",
            script: "wait-on packages/admin/lib && npm run --prefix packages/admin-react-select start",
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-rte",
            script: "npm run --prefix packages/admin-rte start",
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-theme",
            script: "wait-on packages/admin/lib packages/admin-color-picker/lib packages/admin-icons/lib packages/admin-react-select/lib packages/admin-rte/lib && npm run --prefix packages/admin-theme start",
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-storybook",
            script: "wait-on packages/admin/lib packages/admin-color-picker/lib packages/admin-icons/lib packages/admin-date-time/lib packages/admin-react-select/lib packages/admin-rte/lib packages/admin-theme/lib && npm run --prefix packages/admin-stories storybook",
            namespace: "comet-admin",
            autorestart: true,
        },
    ],
};
