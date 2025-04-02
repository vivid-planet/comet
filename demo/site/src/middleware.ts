import { withAdminRedirectMiddleware } from "./middleware/adminRedirect";
import { chain } from "./middleware/chain";
import { withCspHeadersMiddleware } from "./middleware/cspHeaders";
import { withDamRewriteMiddleware } from "./middleware/damRewrite";
import { withDomainRewriteMiddleware } from "./middleware/domainRewrite";
import { withPredefinedPagesMiddleware } from "./middleware/predefinedPages";
import { withPreviewMiddleware } from "./middleware/preview";
import { withRedirectToMainHostMiddleware } from "./middleware/redirectToMainHost";
import { withSitePreviewMiddleware } from "./middleware/sitePreview";
import { withSkipMiddleware } from "./middleware/skip";
import { withStatusMiddleware } from "./middleware/status";

export default chain([
    withSkipMiddleware,
    withStatusMiddleware,
    withSitePreviewMiddleware,
    withRedirectToMainHostMiddleware,
    withAdminRedirectMiddleware,
    withDamRewriteMiddleware,
    withCspHeadersMiddleware, // order matters: after redirects (that don't need csp headers), before everything else that needs csp headers
    withPreviewMiddleware,
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
