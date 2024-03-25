/* eslint-disable no-console */

export let domain = "";

if (!process.env.NEXT_PUBLIC_SITE_DOMAIN) {
    console.error('Environment variable NEXT_PUBLIC_SITE_DOMAIN not set, defaulting to ""');
} else {
    domain = process.env.NEXT_PUBLIC_SITE_DOMAIN;
}
