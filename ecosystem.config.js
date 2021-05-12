module.exports = {
    apps: [
        {
            name: "comet-admin-watch",
            script: "lerna run --stream --no-sort --concurrency 999 start",
            namespace: "comet-admin",
            autorestart: true,
        },
        {
            name: "comet-admin-storybook",
            script: "npm run --prefix packages/admin-stories storybook",
            namespace: "comet-admin",
            autorestart: true,
        },
    ],
};
