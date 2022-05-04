/* eslint-disable no-console */
export enum aspectRatios {
    "16x9" = "16x9",
    "4x3" = "4x3",
    "3x2" = "3x2",
    "3x1" = "3x1",
    "2x1" = "2x1",
    "1x1" = "1x1",
    "1x2" = "1x2",
    "2x3" = "2x3",
    "3x4" = "3x4",
    "9x16" = "9x16",
}

export let domain = "";

if (!process.env.SITE_DOMAIN) {
    console.error('Environment variable SITE_DOMAIN not set, defaulting to ""');
} else {
    domain = process.env.SITE_DOMAIN;
}

export let languages: string[] = [];

if (!process.env.SITE_LANGUAGES) {
    console.error("Environment variable SITE_LANGUAGES not set, defaulting to []");
} else {
    languages = process.env.SITE_LANGUAGES.split(",");
}

export let defaultLanguage = "";

if (!process.env.SITE_DEFAULT_LANGUAGE) {
    console.error('Environment variable SITE_DEFAULT_LANGUAGE not set, defaulting to ""');
} else {
    defaultLanguage = process.env.SITE_DEFAULT_LANGUAGE;
}
