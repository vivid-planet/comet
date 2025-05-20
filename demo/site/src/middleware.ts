import { withAdminRedirectMiddleware } from "./middleware/adminRedirect";
import { chain } from "./middleware/chain";
import { withCspHeadersMiddleware } from "./middleware/cspHeaders";
import { withDamRewriteMiddleware } from "./middleware/damRewrite";
import { withDomainRewriteMiddleware } from "./middleware/domainRewrite";
import { withPredefinedPagesMiddleware } from "./middleware/predefinedPages";
import { withPreviewMiddleware } from "./middleware/preview";
import { withRedirectToMainHostMiddleware } from "./middleware/redirectToMainHost";
import { withRobotsMiddleware } from "./middleware/robots";
import { withSkipRewriteMiddleware } from "./middleware/skipRewrite";
import { withStatusMiddleware } from "./middleware/status";

export default chain([
    withStatusMiddleware,
    withAdminRedirectMiddleware,
    withSkipRewriteMiddleware,
    withDamRewriteMiddleware,
    withCspHeadersMiddleware,
    withPreviewMiddleware,
    withRedirectToMainHostMiddleware,
    withRobotsMiddleware,
    withPredefinedPagesMiddleware,
    withDomainRewriteMiddleware, // must be last (rewrites all urls)
]);

export const config = {
    matcher: ["/(.*)"],
    // TODO find a better solution for this (https://nextjs.org/docs/messages/edge-dynamic-code-evaluation)
    unstable_allowDynamic: [
        "/node_modules/graphql/**",
        /*
         * cache-manager uses lodash.clonedeep which uses dynamic code evaluation.
         * See https://github.com/lodash/lodash/issues/5525.
         */
        "**/node_modules/.pnpm/**/lodash.clonedeep/**",
    ],
};
