import { withAdminRedirectMiddleware } from "./middleware/adminRedirect";
import { chain } from "./middleware/chain";
import { withCspHeadersMiddleware } from "./middleware/cspHeaders";
import { withDamRewriteMiddleware } from "./middleware/damRewrite";
import { withDomainRewriteMiddleware } from "./middleware/domainRewrite";
import { withPredefinedPagesMiddleware } from "./middleware/predefinedPages";
import { withPreviewMiddleware } from "./middleware/preview";
import { withRedirectToMainHostMiddleware } from "./middleware/redirectToMainHost";
import { withStatusMiddleware } from "./middleware/status";

export default chain([
    withStatusMiddleware,
    withAdminRedirectMiddleware,
    withDamRewriteMiddleware,
    withCspHeadersMiddleware,
    withPreviewMiddleware,
    withRedirectToMainHostMiddleware,
    withPredefinedPagesMiddleware,
    withDomainRewriteMiddleware, // must be last (rewrites all urls)
]);

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, favicon.svg, favicon.png
         * - manifest.json
         * - assets (assets from /public folder)
         * - robots.txt
         */
        "/((?!_next/static|_next/image|favicon.ico|favicon.svg|favicon.png|manifest.json|assets/|robots.txt).*)",
    ],
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
