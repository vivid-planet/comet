"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cms_site_1 = require("@comet/cms-site");
function createGraphQLClient(previewData) {
    return (0, cms_site_1.createGraphQLClient)("".concat(process.env.API_URL_INTERNAL, "/graphql"), previewData);
}
exports.default = createGraphQLClient;
