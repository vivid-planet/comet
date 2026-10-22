import { handleError } from "@src/framework/handleError";
import { renderPage } from "@src/framework/render";
import { getSiteContext } from "@src/framework/requestContext";
import type { ContentScope } from "@src/site-configs";
import { getPreviewParams } from "@src/util/sitePreview";
import { type Context, Hono } from "hono";
import type { ReactNode } from "react";

import PagePage from "./[language]/[[...path]]/page";
import LanguageLayout, { getLayoutLanguage } from "./[language]/layout";
import NewsDetailPage from "./[language]/news/[slug]/page";
import NewsIndexPage from "./[language]/news/page";
import SiteNotFound from "./[language]/not-found";
import ProductDetailPage from "./[language]/product/[slug]/page";
import ProductListPage from "./[language]/product/page";
import BrevoEmailCampaignBlockPreviewPage from "./block-preview/[domain]/[language]/brevo-email-campaign/page";
import FooterBlockPreviewPage from "./block-preview/[domain]/[language]/footer/page";
import BlockPreviewLanguageLayout from "./block-preview/[domain]/[language]/layout";
import MainMenuBlockPreviewPage from "./block-preview/[domain]/[language]/main-menu/page";
import PageBlockPreviewPage from "./block-preview/[domain]/[language]/page/page";
import StageBlockPreviewPage from "./block-preview/[domain]/[language]/stage/page";
import WelcomeEmailBlockPreviewPage from "./block-preview/[domain]/[language]/welcome-email/page";
import BlockPreviewLayout from "./block-preview/[domain]/layout";
import { graphQLRoute } from "./graphql/route";
import RootLayout from "./layout";
import RootNotFound from "./not-found";
import { robotsRoute } from "./robots";
import { sitePreviewRoute } from "./site-preview/route";
import { sitemapRoute } from "./sitemap";

const noStoreCacheControl = "private, no-cache, no-store, max-age=0, must-revalidate";
// Same as Next.js for pages revalidated every 7.5 minutes
const publicCacheControl = "s-maxage=450, stale-while-revalidate=31535550";

async function renderSitePage(c: Context, renderContent: (params: ContentScope) => ReactNode) {
    const { domain } = getSiteContext();
    const language = c.req.param("language");
    if (!language) {
        throw new Error("Site pages must be routed with a language param");
    }
    const params = { domain, language };
    const isSitePreview = (await getPreviewParams()) !== null;

    return renderPage(c, {
        root: (
            <RootLayout lang={getLayoutLanguage(params)}>
                <LanguageLayout domain={domain} language={language}>
                    {renderContent(params)}
                </LanguageLayout>
            </RootLayout>
        ),
        notFound: () => (
            <RootLayout lang={getLayoutLanguage(params)}>
                <LanguageLayout domain={domain} language={language}>
                    <SiteNotFound scope={{ domain, language: getLayoutLanguage(params) }} />
                </LanguageLayout>
            </RootLayout>
        ),
        cacheControl: isSitePreview ? noStoreCacheControl : publicCacheControl,
    });
}

function renderBlockPreviewPage(c: Context, page: ReactNode) {
    const { domain, language } = c.req.param() as ContentScope;

    return renderPage(c, {
        root: (
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

function renderRootNotFoundPage(c: Context) {
    return renderPage(c, {
        root: renderRootNotFound(),
        notFound: renderRootNotFound,
        cacheControl: noStoreCacheControl,
        status: 404,
    });
}

async function loadSsrEntry() {
    return import.meta.viteRsc.loadModule<typeof import("@src/framework/entry.ssr")>("ssr", "index");
}

/**
 * Handles the requests that skip the site middlewares, see `handler.ts`
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

router.notFound(renderRootNotFoundPage);
router.onError(handleError);

/**
 * Handles the requests of the site after the middlewares have been applied, see `handler.ts`.
 * The domain and visibility are available via `getSiteContext()`.
 */
export const siteRouter = new Hono({ strict: false });

siteRouter.on(["GET", "POST"], "/graphql", graphQLRoute);
siteRouter.get("/sitemap.xml", sitemapRoute);
siteRouter.get("/", (c) => c.redirect("/en", 307));

// Loaded on demand, so that missing environment variables of these routes don't break the whole site
siteRouter.post("/:language/api/contact-form", async (c) => (await import("./[language]/api/contact-form/route")).contactFormRoute(c));
siteRouter.post("/:language/api/file-upload", async (c) => (await import("./[language]/api/file-upload/route")).fileUploadRoute(c));

siteRouter.get("/:language/news", (c) => renderSitePage(c, (params) => <NewsIndexPage {...params} />));
siteRouter.get("/:language/news/:slug", (c) => renderSitePage(c, (params) => <NewsDetailPage {...params} slug={c.req.param("slug")} />));
siteRouter.get("/:language/product", (c) => renderSitePage(c, ({ language }) => <ProductListPage language={language} />));
siteRouter.get("/:language/product/:slug", (c) => renderSitePage(c, () => <ProductDetailPage slug={c.req.param("slug")} />));
siteRouter.get("/:language/*", (c) => {
    const [, , ...segments] = c.req.path.split("/");
    const path = segments.filter((segment) => segment !== "").map((segment) => decodeURIComponent(segment));
    return renderSitePage(c, (params) => <PagePage {...params} path={path} />);
});

siteRouter.notFound(renderRootNotFoundPage);
siteRouter.onError(handleError);
