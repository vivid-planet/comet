module.exports = {
    apps: [
        {
            name: "comet-admin",
            script: "npm run --prefix packages/admin/admin start",
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-color-picker",
            script: "wait-on packages/admin/admin/lib && npm run --prefix packages/admin/admin-color-picker start",
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-date-picker",
            script: "wait-on packages/admin/admin/lib && npm run --prefix packages/admin/admin-date-picker start",
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-icons",
            script: "npm run --prefix packages/admin/admin-icons start",
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-react-select",
            script: "wait-on packages/admin/admin/lib && npm run --prefix packages/admin/admin-react-select start",
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-rte",
            script: "npm run --prefix packages/admin/admin-rte start",
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-theme",
            script: "wait-on packages/admin/admin/lib packages/admin/admin-color-picker/lib packages/admin/admin-icons/lib packages/admin/admin-react-select/lib packages/admin/admin-rte/lib && npm run --prefix packages/admin/admin-theme start",
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-storybook",
            script: "wait-on packages/admin/admin/lib packages/admin/admin-color-picker/lib packages/admin/admin-date-picker/lib packages/admin/admin-icons/lib packages/admin/admin-react-select/lib packages/admin/admin-rte/lib packages/admin/admin-theme/lib && npm run --prefix packages/admin/admin-stories storybook",
            namespace: "comet-admin",
            autorestart: true,
        },
    ],
};
