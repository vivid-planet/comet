import { handleError } from "@src/framework/handleError";
import type { Metadata } from "@src/framework/metadata";
import { type PageContent, renderPage } from "@src/framework/render";
import { setVisibilityParam } from "@src/framework/requestContext";
import type { VisibilityParam } from "@src/middleware/domainRewrite";
import type { ContentScope } from "@src/site-configs";
import { getPreviewParams } from "@src/util/sitePreview";
import { type Context, Hono } from "hono";

import PagePage, { generateMetadata as generatePageMetadata } from "./[visibility]/[domain]/[language]/[[...path]]/page";
import LanguageLayout, { getLayoutLanguage } from "./[visibility]/[domain]/[language]/layout";
import NewsDetailPage from "./[visibility]/[domain]/[language]/news/[slug]/page";
import NewsIndexPage from "./[visibility]/[domain]/[language]/news/page";
import SiteNotFound from "./[visibility]/[domain]/[language]/not-found";
import ProductDetailPage from "./[visibility]/[domain]/[language]/product/[slug]/page";
import ProductListPage from "./[visibility]/[domain]/[language]/product/page";
import { graphQLRoute } from "./[visibility]/[domain]/graphql/route";
import SiteLayout from "./[visibility]/[domain]/layout";
import { sitemapRoute } from "./[visibility]/[domain]/sitemap";
import BrevoEmailCampaignBlockPreviewPage from "./block-preview/[domain]/[language]/brevo-email-campaign/page";
import FooterBlockPreviewPage from "./block-preview/[domain]/[language]/footer/page";
import BlockPreviewLanguageLayout from "./block-preview/[domain]/[language]/layout";
import MainMenuBlockPreviewPage from "./block-preview/[domain]/[language]/main-menu/page";
import PageBlockPreviewPage from "./block-preview/[domain]/[language]/page/page";
import StageBlockPreviewPage from "./block-preview/[domain]/[language]/stage/page";
import WelcomeEmailBlockPreviewPage from "./block-preview/[domain]/[language]/welcome-email/page";
import BlockPreviewLayout from "./block-preview/[domain]/layout";
import RootLayout from "./layout";
import RootNotFound from "./not-found";
import { robotsRoute } from "./robots";
import { sitePreviewRoute } from "./site-preview/route";

const noStoreCacheControl = "private, no-cache, no-store, max-age=0, must-revalidate";
// Same as Next.js for pages revalidated every 7.5 minutes
const publicCacheControl = "s-maxage=450, stale-while-revalidate=31535550";

type SitePageParams = ContentScope & { visibility: string };

async function renderSitePage(
    c: Context,
    loadPage: (params: SitePageParams) => Promise<PageContent>,
    generateMetadata?: (params: SitePageParams) => Promise<Metadata>,
) {
    const params = c.req.param() as SitePageParams;
    const { visibility, domain, language } = params;
    setVisibilityParam(visibility as VisibilityParam);
    const isSitePreview = (await getPreviewParams()) !== null;
    const metadata = generateMetadata?.(params);
    // The metadata isn't awaited if rendering is aborted, e.g. for the not found page
    metadata?.catch(() => undefined);

    return renderPage(c, {
        page: loadPage(params),
        layout: (page) => (
            <RootLayout lang={getLayoutLanguage(params)} metadata={metadata}>
                <SiteLayout domain={domain}>
                    <LanguageLayout domain={domain} language={language}>
                        {page}
                    </LanguageLayout>
                </SiteLayout>
            </RootLayout>
        ),
        notFound: () => (
            <RootLayout lang={getLayoutLanguage(params)}>
                <SiteLayout domain={domain}>
                    <LanguageLayout domain={domain} language={language}>
                        <SiteNotFound scope={{ domain, language: getLayoutLanguage(params) }} />
                    </LanguageLayout>
                </SiteLayout>
            </RootLayout>
        ),
        cacheControl: isSitePreview ? noStoreCacheControl : publicCacheControl,
    });
}

function renderBlockPreviewPage(c: Context, page: PageContent) {
    const { domain, language } = c.req.param() as ContentScope;

    return renderPage(c, {
        page: Promise.resolve(page),
        layout: (page) => (
            <RootLayout lang={language}>
                <BlockPreviewLayout domain={domain}>
                    <BlockPreviewLanguageLayout language={language}>{page}</BlockPreviewLanguageLayout>
                </BlockPreviewLayout>
            </RootLayout>
        ),
        notFound: renderRootNotFound,
        cacheControl: noStoreCacheControl,
    });
}

function renderRootNotFound() {
    return (
        <RootLayout lang="en">
            <RootNotFound />
        </RootLayout>
    );
}

async function loadSsrEntry() {
    return import.meta.viteRsc.loadModule<typeof import("@src/framework/entry.ssr")>("ssr", "index");
}

/**
 * Handles the requests after the middlewares have been applied, see `handler.ts`
 */
export const router = new Hono({ strict: false });

router.get("/robots.txt", robotsRoute);
router.get("/site-preview", sitePreviewRoute);

// Mails are rendered with react-dom/server, which is only available in the SSR environment
router.post("/api/render-brevo-email-campaign", async (c) => (await loadSsrEntry()).renderBrevoEmailCampaign(c.req.raw));
router.get("/api/render-welcome-email", async (c) => (await loadSsrEntry()).renderWelcomeEmail(c.req.raw));

router.get("/block-preview/:domain/:language/page", (c) => renderBlockPreviewPage(c, <PageBlockPreviewPage />));
router.get("/block-preview/:domain/:language/stage", (c) => renderBlockPreviewPage(c, <StageBlockPreviewPage />));
router.get("/block-preview/:domain/:language/main-menu", (c) => renderBlockPreviewPage(c, <MainMenuBlockPreviewPage />));
router.get("/block-preview/:domain/:language/footer", (c) => renderBlockPreviewPage(c, <FooterBlockPreviewPage />));
router.get("/block-preview/:domain/:language/welcome-email", (c) =>
    renderBlockPreviewPage(c, <WelcomeEmailBlockPreviewPage {...(c.req.param() as ContentScope)} />),
);
router.get("/block-preview/:domain/:language/brevo-email-campaign", (c) =>
    renderBlockPreviewPage(c, <BrevoEmailCampaignBlockPreviewPage {...(c.req.param() as ContentScope)} />),
);

router.on(["GET", "POST"], "/:visibility/:domain/graphql", graphQLRoute);
router.get("/:visibility/:domain/sitemap.xml", sitemapRoute);
router.get("/:visibility/:domain", (c) => c.redirect("/en", 307));

// Loaded on demand, so that missing environment variables of these routes don't break the whole site
router.post("/:visibility/:domain/:language/api/contact-form", async (c) =>
    (await import("./[visibility]/[domain]/[language]/api/contact-form/route")).contactFormRoute(c),
);
router.post("/:visibility/:domain/:language/api/file-upload", async (c) =>
    (await import("./[visibility]/[domain]/[language]/api/file-upload/route")).fileUploadRoute(c),
);

router.get("/:visibility/:domain/:language/news", (c) => renderSitePage(c, NewsIndexPage));
router.get("/:visibility/:domain/:language/news/:slug", (c) =>
    renderSitePage(c, (params) => NewsDetailPage({ ...params, slug: c.req.param("slug") })),
);
router.get("/:visibility/:domain/:language/product", (c) => renderSitePage(c, ProductListPage));
router.get("/:visibility/:domain/:language/product/:slug", (c) => renderSitePage(c, () => ProductDetailPage({ slug: c.req.param("slug") })));
router.get("/:visibility/:domain/:language/*", (c) => {
    const [, , , , ...path] = c.req.path.split("/");
    const params = { path: path.filter((segment) => segment !== "").map((segment) => decodeURIComponent(segment)) };
    return renderSitePage(
        c,
        (sitePageParams) => PagePage({ ...sitePageParams, ...params }),
        (sitePageParams) => generatePageMetadata({ ...sitePageParams, ...params }),
    );
});

router.notFound((c) =>
    renderPage(c, {
        page: Promise.resolve(null),
        layout: renderRootNotFound,
        notFound: renderRootNotFound,
        cacheControl: noStoreCacheControl,
        status: 404,
    }),
);

router.onError(handleError);
