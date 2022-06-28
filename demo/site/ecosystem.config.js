module.exports = {
    apps: [
        {
            name: "next-server",
            script: "npx yarn start",
        },
        {
            name: "next-server-internal-api",
            script: "node next-server-internal-api.js",
        },
    ],
};
