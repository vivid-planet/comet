/* eslint-disable no-console */

export let domain = "";

if (!process.env.NEXT_PUBLIC_SITE_PAGES_DOMAIN) {
    console.error('Environment variable NEXT_PUBLIC_SITE_DOMAIN not set, defaulting to ""');
} else {
    domain = process.env.NEXT_PUBLIC_SITE_PAGES_DOMAIN;
}

export let languages: string[] = [];

if (!process.env.NEXT_PUBLIC_SITE_LANGUAGES) {
    console.error("Environment variable NEXT_PUBLIC_SITE_LANGUAGES not set, defaulting to []");
} else {
    languages = process.env.NEXT_PUBLIC_SITE_LANGUAGES.split(",");
}

export let defaultLanguage = "";

if (!process.env.NEXT_PUBLIC_SITE_DEFAULT_LANGUAGE) {
    console.error('Environment variable NEXT_PUBLIC_SITE_DEFAULT_LANGUAGE not set, defaulting to ""');
} else {
    defaultLanguage = process.env.NEXT_PUBLIC_SITE_DEFAULT_LANGUAGE;
}
