"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultLanguage = exports.languages = exports.domain = void 0;
exports.domain = "";
if (!process.env.NEXT_PUBLIC_SITE_DOMAIN) {
    console.error('Environment variable NEXT_PUBLIC_SITE_DOMAIN not set, defaulting to ""');
}
else {
    exports.domain = process.env.NEXT_PUBLIC_SITE_DOMAIN;
}
exports.languages = [];
if (!process.env.NEXT_PUBLIC_SITE_LANGUAGES) {
    console.error("Environment variable NEXT_PUBLIC_SITE_LANGUAGES not set, defaulting to []");
}
else {
    exports.languages = process.env.NEXT_PUBLIC_SITE_LANGUAGES.split(",");
}
exports.defaultLanguage = "";
if (!process.env.NEXT_PUBLIC_SITE_DEFAULT_LANGUAGE) {
    console.error('Environment variable NEXT_PUBLIC_SITE_DEFAULT_LANGUAGE not set, defaulting to ""');
}
else {
    exports.defaultLanguage = process.env.NEXT_PUBLIC_SITE_DEFAULT_LANGUAGE;
}
