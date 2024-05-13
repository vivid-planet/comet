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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRedirects = void 0;
var graphql_request_1 = require("graphql-request");
var config_1 = require("../../src/config");
var createGraphQLClient_1 = __importDefault(require("../../src/util/createGraphQLClient"));
var createRedirects = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = [[]];
                return [4 /*yield*/, createApiRedirects()];
            case 1:
                _b = [__spreadArray.apply(void 0, _a.concat([(_c.sent()), true]))];
                return [4 /*yield*/, createInternalRedirects()];
            case 2: return [2 /*return*/, __spreadArray.apply(void 0, _b.concat([(_c.sent()), true]))];
        }
    });
}); };
exports.createRedirects = createRedirects;
var createInternalRedirects = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (process.env.ADMIN_URL === undefined) {
            console.error("Cannot create \"/admin\" redirect: Missing ADMIN_URL environment variable");
            return [2 /*return*/, []];
        }
        return [2 /*return*/, [
                {
                    source: "/admin",
                    destination: process.env.ADMIN_URL,
                    permanent: false,
                },
            ]];
    });
}); };
var createApiRedirects = function () { return __awaiter(void 0, void 0, void 0, function () {
    function replaceRegexCharacters(value) {
        // escape ":" and "?", otherwise it is used for next.js regex path matching  (https://nextjs.org/docs/pages/api-reference/next-config-js/redirects#regex-path-matching)
        return value.replace(/[:?]/g, "\\$&");
    }
    var query, apiUrl, response, redirects, _loop_1, _i, _a, redirect;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                query = (0, graphql_request_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        query Redirects($scope: RedirectScopeInput!) {\n            redirects(scope: $scope, active: true) {\n                sourceType\n                source\n                target\n            }\n        }\n    "], ["\n        query Redirects($scope: RedirectScopeInput!) {\n            redirects(scope: $scope, active: true) {\n                sourceType\n                source\n                target\n            }\n        }\n    "])));
                apiUrl = process.env.API_URL_INTERNAL;
                if (!apiUrl) {
                    console.error("No Environment Variable API_URL_INTERNAL available. Can not perform redirect config");
                    return [2 /*return*/, []];
                }
                return [4 /*yield*/, (0, createGraphQLClient_1.default)().request(query, { scope: { domain: config_1.domain } })];
            case 1:
                response = _d.sent();
                redirects = [];
                _loop_1 = function (redirect) {
                    var source = void 0;
                    var destination = void 0;
                    var has;
                    if (redirect.sourceType === "path") {
                        // query parameters have to be defined with has, see: https://nextjs.org/docs/pages/api-reference/next-config-js/redirects#header-cookie-and-query-matching
                        if ((_b = redirect.source) === null || _b === void 0 ? void 0 : _b.includes("?")) {
                            var searchParamsString = redirect.source.split("?").slice(1).join("?");
                            var searchParams = new URLSearchParams(searchParamsString);
                            has = [];
                            searchParams.forEach(function (value, key) {
                                if (has) {
                                    has.push({ type: "query", key: key, value: replaceRegexCharacters(value) });
                                }
                            });
                            source = replaceRegexCharacters(redirect.source.replace(searchParamsString, ""));
                        }
                        else {
                            source = replaceRegexCharacters(redirect.source);
                        }
                    }
                    var target = redirect.target;
                    if (target.block !== undefined) {
                        switch (target.block.type) {
                            case "internal":
                                destination = (_c = target.block.props.targetPage) === null || _c === void 0 ? void 0 : _c.path;
                                break;
                            case "external":
                                destination = target.block.props.targetUrl;
                                break;
                            case "news":
                                if (target.block.props.id !== undefined) {
                                    destination = "/news/".concat(target.block.props.id);
                                }
                                break;
                        }
                    }
                    if (source === destination) {
                        console.warn("Skipping redirect loop ".concat(source, " -> ").concat(destination));
                        return "continue";
                    }
                    if (source && destination) {
                        redirects.push({ source: source, destination: destination, has: has, permanent: true });
                    }
                };
                for (_i = 0, _a = response.redirects; _i < _a.length; _i++) {
                    redirect = _a[_i];
                    _loop_1(redirect);
                }
                return [2 /*return*/, redirects];
        }
    });
}); };
var templateObject_1;
