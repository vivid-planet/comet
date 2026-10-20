import type { ErrorHandler } from "hono";

import { RedirectError } from "./navigation";

export const handleError: ErrorHandler = (error, c) => {
    if (error instanceof RedirectError) {
        return c.redirect(error.location, error.status);
    }
    console.error("Error occurred handling", c.req.url, error);
    return c.text("Internal Server Error", 500);
};
