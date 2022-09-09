const api = require("./ecosystem-demo-api.config").apps;
const admin = require("./ecosystem-demo-admin.config").apps;
const site = require("./ecosystem-demo-site.config").apps;

module.exports = {
    apps: [...api, ...admin, ...site],
};
