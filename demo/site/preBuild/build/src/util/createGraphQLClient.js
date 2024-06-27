"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_request_1 = require("graphql-request");
var defaultOptions = {
    includeInvisiblePages: false,
    includeInvisibleBlocks: false,
    previewDamUrls: false,
};
function createGraphQLClient(options) {
    if (options === void 0) { options = {}; }
    var _a = __assign(__assign({}, defaultOptions), options), includeInvisibleBlocks = _a.includeInvisibleBlocks, includeInvisiblePages = _a.includeInvisiblePages, previewDamUrls = _a.previewDamUrls;
    var headers = {};
    var includeInvisibleContentHeaderEntries = [];
    if (includeInvisiblePages) {
        includeInvisibleContentHeaderEntries.push("Pages:Unpublished");
    }
    if (includeInvisibleBlocks) {
        includeInvisibleContentHeaderEntries.push("Blocks:Invisible");
    }
    // tells api to send invisble content
    // authentication is required when this header is used
    if (includeInvisibleContentHeaderEntries.length > 0) {
        headers["x-include-invisible-content"] = includeInvisibleContentHeaderEntries.join(",");
    }
    // tells api to create preview image urls
    // authentication is required when this header is used
    if (previewDamUrls) {
        headers["x-preview-dam-urls"] = "1";
    }
    return new graphql_request_1.GraphQLClient("".concat(process.env.API_URL_INTERNAL, "/graphql"), {
        headers: headers,
    });
}
exports.default = createGraphQLClient;
