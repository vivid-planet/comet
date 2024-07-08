module.exports = {
    apps: [
        {
            name: "next-server",
            script: "pnpm start",
        },
        {
            name: "next-server-internal-api",
            script: "node next-server-internal-api.js",
        },
    ],
};
