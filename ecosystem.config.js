module.exports = {
    apps: [
        {
            name: "comet-admin",
            script: "wait-on packages/admin-icons/lib && yarn workspace @comet/admin start",
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-color-picker",
            script: "wait-on packages/admin/lib && yarn workspace @comet/admin-color-picker start",
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-date-picker",
            script: "wait-on packages/admin/lib && yarn workspace @comet/admin-date-picker start",
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-icons",
            script: "yarn workspace @comet/admin-icons start",
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-react-select",
            script: "wait-on packages/admin/lib && yarn workspace @comet/admin-react-select start",
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-rte",
            script: "yarn workspace @comet/admin-rte start",
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-theme",
            script: "wait-on packages/admin/lib packages/admin-color-picker/lib packages/admin-icons/lib packages/admin-react-select/lib packages/admin-rte/lib && yarn workspace @comet/admin-theme start",
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-storybook",
            script: "wait-on packages/admin/lib packages/admin-color-picker/lib packages/admin-date-picker/lib packages/admin-icons/lib packages/admin-react-select/lib packages/admin-rte/lib packages/admin-theme/lib && yarn workspace @comet/admin-stories storybook",
            namespace: "comet-admin",
            autorestart: true,
        },
    ],
};
