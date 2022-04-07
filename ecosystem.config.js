module.exports = {
    apps: [
        {
            name: "comet-admin",
            script: "npx yarn workspace @comet/admin start",
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-color-picker",
            script: "npx wait-on packages/admin/admin/lib && npx yarn workspace @comet/admin-color-picker start",
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-date-time",
            script: "npx wait-on packages/admin/admin/lib && npx yarn workspace @comet/admin-date-time start",
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
            script: "npx wait-on packages/admin/admin/lib && npx yarn workspace @comet/admin-react-select start",
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
            script: "npx wait-on packages/admin/admin/lib packages/admin/admin-color-picker/lib packages/admin/admin-icons/lib packages/admin/admin-react-select/lib packages/admin/admin-rte/lib && npx yarn workspace @comet/admin-theme start",
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-storybook",
            script: "npx wait-on packages/admin/admin/lib packages/admin/admin-color-picker/lib packages/admin/admin-date-time/lib packages/admin/admin-icons/lib packages/admin/admin-react-select/lib packages/admin/admin-rte/lib packages/admin/admin-theme/lib && npx yarn workspace comet-admin-stories storybook",
            namespace: "comet-admin",
            autorestart: true,
        },
    ],
};
