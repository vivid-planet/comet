const api = require("./ecosystem-cms-api.config").apps;
const admin = require("./ecosystem-cms-admin.config").apps;
const site = require("./ecosystem-cms-site.config").apps;

module.exports = {
    apps: [...api, ...admin, ...site],
};
