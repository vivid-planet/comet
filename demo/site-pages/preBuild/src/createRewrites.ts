import { Rewrite } from "next/dist/lib/load-custom-routes";

import { getRedirects } from "./createRedirects";

const createRewrites = async () => {
    const apiUrl = process.env.API_URL_INTERNAL;
    if (!apiUrl) {
        console.error("No Environment Variable API_URL_INTERNAL available. Can not perform redirect config");
        return { redirects: [], rewrites: [] };
    }

    const rewrites: Rewrite[] = [];

    for await (const redirect of getRedirects()) {
        const { source, destination } = redirect;

        // A rewrite is created for each redirect where the source and destination differ only by casing (otherwise, this causes a redirection loop).
        // For instance, a rewrite is created for the redirect /Example -> /example.
        if (source && destination && source.toLowerCase() === destination.toLowerCase()) {
            rewrites.push({ source, destination });
        }
    }

    return rewrites;
};

export { createRewrites };
