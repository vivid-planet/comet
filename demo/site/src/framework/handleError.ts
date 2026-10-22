import type { ErrorHandler } from "hono";

import { getNavigationErrorDigest, parseRedirectDigest } from "./navigation";

export const handleError: ErrorHandler = (error, c) => {
    const digest = getNavigationErrorDigest(error);
    const redirect = digest ? parseRedirectDigest(digest) : undefined;
    if (redirect) {
        return c.redirect(redirect.location, redirect.status);
    }
    console.error("Error occurred handling", c.req.url, error);
    return c.text("Internal Server Error", 500);
};
