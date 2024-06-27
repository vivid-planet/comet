"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRedirects = exports.getRedirects = void 0;
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
var redirectsQuery = (0, graphql_request_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    query Redirects($scope: RedirectScopeInput!, $filter: RedirectFilter, $sort: [RedirectSort!], $offset: Int!, $limit: Int!) {\n        paginatedRedirects(scope: $scope, filter: $filter, sort: $sort, offset: $offset, limit: $limit) {\n            nodes {\n                sourceType\n                source\n                target\n            }\n            totalCount\n        }\n    }\n"], ["\n    query Redirects($scope: RedirectScopeInput!, $filter: RedirectFilter, $sort: [RedirectSort!], $offset: Int!, $limit: Int!) {\n        paginatedRedirects(scope: $scope, filter: $filter, sort: $sort, offset: $offset, limit: $limit) {\n            nodes {\n                sourceType\n                source\n                target\n            }\n            totalCount\n        }\n    }\n"])));
function replaceRegexCharacters(value) {
    // escape ":" and "?", otherwise it is used for next.js regex path matching  (https://nextjs.org/docs/pages/api-reference/next-config-js/redirects#regex-path-matching)
    return value.replace(/[:?]/g, "\\$&");
}
function getRedirects() {
    return __asyncGenerator(this, arguments, function getRedirects_1() {
        var offset, limit, paginatedRedirects;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    offset = 0;
                    limit = 100;
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 5];
                    return [4 /*yield*/, __await((0, createGraphQLClient_1.default)().request(redirectsQuery, {
                            filter: { active: { equal: true } },
                            sort: { field: "createdAt", direction: "DESC" },
                            offset: offset,
                            limit: limit,
                            scope: { domain: config_1.domain },
                        }))];
                case 2:
                    paginatedRedirects = (_a.sent()).paginatedRedirects;
                    return [5 /*yield**/, __values(__asyncDelegator(__asyncValues(paginatedRedirects.nodes.map(function (redirect) {
                            var _a, _b;
                            var source;
                            var destination;
                            var has;
                            if (redirect.sourceType === "path") {
                                // query parameters have to be defined with has, see: https://nextjs.org/docs/pages/api-reference/next-config-js/redirects#header-cookie-and-query-matching
                                if ((_a = redirect.source) === null || _a === void 0 ? void 0 : _a.includes("?")) {
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
                                        destination = (_b = target.block.props.targetPage) === null || _b === void 0 ? void 0 : _b.path;
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
                            return __assign(__assign({}, redirect), { source: source, destination: destination, has: has });
                        }))))];
                case 3: return [4 /*yield*/, __await.apply(void 0, [_a.sent()])];
                case 4:
                    _a.sent();
                    if (offset + limit >= paginatedRedirects.totalCount) {
                        return [3 /*break*/, 5];
                    }
                    offset += limit;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.getRedirects = getRedirects;
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
    var apiUrl, redirects, _a, _b, _c, redirect, source, destination, has, e_1_1;
    var _d, e_1, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                apiUrl = process.env.API_URL_INTERNAL;
                if (!apiUrl) {
                    console.error("No Environment Variable API_URL_INTERNAL available. Can not perform redirect config");
                    return [2 /*return*/, []];
                }
                redirects = [];
                _g.label = 1;
            case 1:
                _g.trys.push([1, 6, 7, 12]);
                _a = true, _b = __asyncValues(getRedirects());
                _g.label = 2;
            case 2: return [4 /*yield*/, _b.next()];
            case 3:
                if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 5];
                _f = _c.value;
                _a = false;
                try {
                    redirect = _f;
                    source = redirect.source, destination = redirect.destination, has = redirect.has;
                    if ((source === null || source === void 0 ? void 0 : source.toLowerCase()) === (destination === null || destination === void 0 ? void 0 : destination.toLowerCase())) {
                        console.warn("Skipping redirect loop ".concat(source, " -> ").concat(destination));
                        return [3 /*break*/, 4];
                    }
                    if (source && destination) {
                        redirects.push({ source: source, destination: destination, has: has, permanent: true });
                    }
                }
                finally {
                    _a = true;
                }
                _g.label = 4;
            case 4: return [3 /*break*/, 2];
            case 5: return [3 /*break*/, 12];
            case 6:
                e_1_1 = _g.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 12];
            case 7:
                _g.trys.push([7, , 10, 11]);
                if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 9];
                return [4 /*yield*/, _e.call(_b)];
            case 8:
                _g.sent();
                _g.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 11: return [7 /*endfinally*/];
            case 12: return [2 /*return*/, redirects];
        }
    });
}); };
var templateObject_1;
