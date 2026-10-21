import { handleError } from "@src/framework/handleError";
import { Hono } from "hono";

import { adminRedirectMiddleware } from "./middleware/adminRedirect";
import { contentSecurityPolicyHeadersMiddleware } from "./middleware/contentSecurityPolicyHeaders";
import { damRewriteMiddleware } from "./middleware/damRewrite";
import type { MiddlewareEnv } from "./middleware/env";
import { predefinedPagesMiddleware } from "./middleware/predefinedPages";
import { previewMiddleware } from "./middleware/preview";
import { redirectToMainHostMiddleware } from "./middleware/redirectToMainHost";
import { robotsMiddleware } from "./middleware/robots";
import { siteContextMiddleware } from "./middleware/siteContext";
import { skipRewriteMiddleware } from "./middleware/skipRewrite";
import { statusMiddleware } from "./middleware/status";

export const app = new Hono<MiddlewareEnv>();

app.use(
    statusMiddleware,
    adminRedirectMiddleware,
    skipRewriteMiddleware,
    damRewriteMiddleware,
    contentSecurityPolicyHeadersMiddleware,
    previewMiddleware,
    redirectToMainHostMiddleware,
    robotsMiddleware, // for robots.txt, the middleware may only be skipped after the main host redirect
    predefinedPagesMiddleware,
    siteContextMiddleware, // must be last (hands the request over to the site router)
);

app.onError(handleError);
