"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var dist_1 = require("graphql-request/dist");
var path_1 = require("path");
var sitemap_1 = require("sitemap");
var createGraphQLClient_1 = __importDefault(require("../../../src/util/createGraphQLClient"));
var createPublicGeneratedDirectory_1 = __importDefault(require("./createPublicGeneratedDirectory"));
var sitemapPageDataQuery = (0, dist_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    query SitemapPageData($contentScope: PageTreeNodeScopeInput!) {\n        pageTreeNodeList(scope: $contentScope) {\n            id\n            path\n            documentType\n            document {\n                __typename\n                ... on DocumentInterface {\n                    id\n                }\n                ... on Page {\n                    updatedAt\n                    seo\n                }\n                ... on Link {\n                    updatedAt\n                }\n            }\n        }\n    }\n"], ["\n    query SitemapPageData($contentScope: PageTreeNodeScopeInput!) {\n        pageTreeNodeList(scope: $contentScope) {\n            id\n            path\n            documentType\n            document {\n                __typename\n                ... on DocumentInterface {\n                    id\n                }\n                ... on Page {\n                    updatedAt\n                    seo\n                }\n                ... on Link {\n                    updatedAt\n                }\n            }\n        }\n    }\n"])));
var sitemapXml = function () { return __awaiter(void 0, void 0, void 0, function () {
    var generatedDirectory, filePath, smStream, domain, languages, defaultLanguage, siteMapEntryCreated, _i, languages_1, language, pageTreeNodeList, _a, pageTreeNodeList_1, pageTreeNode, path, seoBlockFragment;
    var _b, _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                generatedDirectory = (0, createPublicGeneratedDirectory_1.default)();
                filePath = "".concat(generatedDirectory, "sitemap.xml");
                console.log("Start generating sitemap", process.env.API_URL_INTERNAL);
                if (!process.env.API_URL_INTERNAL) {
                    throw new Error("API_URL_INTERNAL not set as environment variable");
                }
                smStream = new sitemap_1.SitemapStream({
                    hostname: process.env.SITE_URL,
                    xmlns: {
                        news: false,
                        xhtml: false,
                        image: false,
                        video: false,
                    },
                });
                smStream.pipe((0, fs_1.createWriteStream)((0, path_1.resolve)(filePath)));
                domain = (_b = process.env.NEXT_PUBLIC_SITE_DOMAIN) !== null && _b !== void 0 ? _b : "";
                languages = (_d = (_c = process.env.NEXT_PUBLIC_SITE_LANGUAGES) === null || _c === void 0 ? void 0 : _c.split(",")) !== null && _d !== void 0 ? _d : [];
                defaultLanguage = (_e = process.env.NEXT_PUBLIC_SITE_DEFAULT_LANGUAGE) !== null && _e !== void 0 ? _e : "";
                siteMapEntryCreated = false;
                _i = 0, languages_1 = languages;
                _h.label = 1;
            case 1:
                if (!(_i < languages_1.length)) return [3 /*break*/, 4];
                language = languages_1[_i];
                return [4 /*yield*/, (0, createGraphQLClient_1.default)().request(sitemapPageDataQuery, { contentScope: { domain: domain, language: language } })];
            case 2:
                pageTreeNodeList = (_h.sent()).pageTreeNodeList;
                for (_a = 0, pageTreeNodeList_1 = pageTreeNodeList; _a < pageTreeNodeList_1.length; _a++) {
                    pageTreeNode = pageTreeNodeList_1[_a];
                    path = void 0;
                    if (language === defaultLanguage) {
                        path = pageTreeNode.path;
                    }
                    else {
                        path = pageTreeNode.path === "/" ? "/".concat(language) : "/".concat(language).concat(pageTreeNode.path);
                    }
                    try {
                        if (((_f = pageTreeNode.document) === null || _f === void 0 ? void 0 : _f.__typename) === "Page") {
                            seoBlockFragment = pageTreeNode.document.seo;
                            if (!seoBlockFragment.noIndex) {
                                console.log("+ add page to sitemap: ".concat(path));
                                smStream.write({
                                    url: path,
                                    priority: Number(seoBlockFragment.priority.replace("_", ".")),
                                    changefreq: seoBlockFragment.changeFrequency,
                                    lastmod: pageTreeNode.document.updatedAt,
                                });
                                siteMapEntryCreated = true;
                            }
                            else {
                                console.log("(skip add page to sitemap: ".concat(path, " because of no index)"));
                            }
                        }
                        else if (((_g = pageTreeNode.document) === null || _g === void 0 ? void 0 : _g.__typename) === "Link") {
                            console.log("(skip add link to sitemap: ".concat(path, ")"));
                        }
                    }
                    catch (e) {
                        console.error(e);
                        console.error("\u26D4\uFE0F  Error adding page ".concat(path, " to sitemap"));
                    }
                }
                _h.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                if (siteMapEntryCreated) {
                    smStream.end();
                }
                console.log("\u2705 Successfully created sitemap.xml: ".concat(filePath));
                return [2 /*return*/];
        }
    });
}); };
exports.default = sitemapXml;
var templateObject_1;
