import { persistedQueryRoute } from "@comet/site-react/persistedQueryRoute";
import { type SitePreviewJwtPayload, type SitePreviewParams, verifyJwt } from "@src/futureLib/previewUtils.ts";
import { BlockPreview } from "@src/routes/BlockPreview.tsx";
import { NotFound } from "@src/routes/NotFound.tsx";
import { Root } from "@src/routes/Root.tsx";
import { RootLayout } from "@src/routes/RootLayout.tsx";
import { sitemapXmlRoute } from "@src/routes/sitemap.xml.ts";
import type { PublicSiteConfig } from "@src/site-configs";
import { cacheLifetimeStorage } from "@src/util/cacheLifetime.ts";
import { fetchPredefinedPages } from "@src/util/predefinedPages.ts";
import type { RedirectError } from "@src/util/rscErrors.ts";
import { getSiteConfigForDomain, getSiteConfigForHost } from "@src/util/siteConfig.ts";
import { sitePreviewParamsStorage } from "@src/util/sitePreview.ts";
import {
    createTemporaryReferenceSet,
    decodeAction,
    decodeFormState,
    decodeReply,
    loadServerAction,
    renderToReadableStream,
} from "@vitejs/plugin-rsc/rsc";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { proxy } from "hono/proxy";
import { SignJWT } from "jose";
import type { ReactFormState } from "react-dom/client";

import { RouterProvider } from "./RouterContext.tsx";

// The schema of payload which is serialized into RSC stream on rsc environment
// and deserialized on ssr/client environments.
export type RscPayload = {
    // this demo renders/serializes/deserizlies entire root html element
    // but this mechanism can be changed to render/fetch different parts of components
    // based on your own route conventions.
    root: React.ReactNode;
    // server action return value of non-progressive enhancement case
    returnValue?: { ok: boolean; data: unknown };
    // server action form state (e.g. useActionState) of progressive enhancement case
    formState?: ReactFormState;
};

async function renderRscPayload(
    passedRscPayload: RscPayload,
    {
        path,
        isRscRequest,
        temporaryReferences,
        siteConfig,
        language,
    }: { path: string; isRscRequest: boolean; temporaryReferences?: unknown; siteConfig: PublicSiteConfig; language: string },
): Promise<Response> {
    const predefinedPages = await fetchPredefinedPages(siteConfig.scope.domain, language); // cached (=fast)

    const rscPayload: RscPayload = {
        ...passedRscPayload,
        root: <RouterProvider value={{ path, language, predefinedPages }}>{passedRscPayload.root}</RouterProvider>,
    };
    const formState = rscPayload.formState;
    const rscStream = renderToReadableStream<RscPayload>(rscPayload, {
        temporaryReferences,
        onError: (error: unknown) => {
            if (error instanceof Error && (error.message === "Redirect" || error.message === "NotFound")) {
                // silence error
            } else {
                console.error("RSC Render Error:", error);
            }
        },
    });

    if (isRscRequest) {
        const [waitForHtmlTagStream, responseRscStream] = rscStream.tee();

        async function waitUntilHtmlTagArrives(stream: ReadableStream<Uint8Array>): Promise<void> {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            stream = stream.pipeThrough(new TextDecoderStream() as any);
            const reader = stream.getReader();

            let previousChunk = "";
            let totalBytes = 0;

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                totalBytes += value.byteLength;

                if ((previousChunk + value).includes(`"$","html"`)) break;
                if (totalBytes >= 20000) break;

                previousChunk += value; // keep only two chunks in memory
            }

            reader.releaseLock();
        }
        await waitUntilHtmlTagArrives(waitForHtmlTagStream);

        const isSitePreviewActive = !!sitePreviewParamsStorage.getStore();
        const cacheLifetime = cacheLifetimeStorage.getStore()?.time;
        const cacheControl = isSitePreviewActive ? "private" : `max-age=${cacheLifetime}, s-maxage=${cacheLifetime}, stale-while-revalidate`;

        return new Response(responseRscStream, {
            status: rscPayload.returnValue?.ok === false ? 500 : undefined,
            headers: {
                "content-type": "text/x-component;charset=utf-8",
                "Cache-Control": cacheControl,
            },
        });
    }

    // Delegate to SSR environment for html rendering.
    // The plugin provides `loadModule` helper to allow loading SSR environment entry module
    // in RSC environment. however this can be customized by implementing own runtime communication
    // e.g. `@cloudflare/vite-plugin`'s service binding.
    const ssrEntryModule = await import.meta.viteRsc.loadModule<typeof import("./entry.ssr.tsx")>("ssr", "index");
    let ssrResult: {
        stream: ReadableStream<Uint8Array>;
        status?: number;
    };
    try {
        ssrResult = await ssrEntryModule.renderHTML(rscStream, {
            formState,
        });
    } catch (e) {
        console.log(e, Object.entries(e));
        if (e instanceof Error && e.message === "Redirect" /*e instanceof RedirectError*/) {
            return new Response("Redirect", { status: 302, headers: { Location: (e as RedirectError).target } });
        } else if (e instanceof Error && e.message === "NotFound" /*e instanceof NotFoundError*/) {
            const rscPayload: RscPayload = {
                root: (
                    <RouterProvider value={{ path: "/404", language, predefinedPages }}>
                        <NotFound language={language} siteConfig={siteConfig} />
                    </RouterProvider>
                ),
                formState: undefined,
                returnValue: undefined,
            };
            const rscStream = renderToReadableStream<RscPayload>(rscPayload, {
                temporaryReferences,
            });
            ssrResult = await ssrEntryModule.renderHTML(rscStream, {
                formState,
            });
            return new Response(ssrResult.stream, { status: 404, headers: { "Content-type": "text/html" } });
        }
        throw e;
    }

    const isSitePreviewActive = !!sitePreviewParamsStorage.getStore();
    const cacheLifetime = cacheLifetimeStorage.getStore()?.time;
    const cacheControl = isSitePreviewActive ? "private" : `max-age=${cacheLifetime}, s-maxage=${cacheLifetime}, stale-while-revalidate`;

    // respond html
    return new Response(ssrResult.stream, {
        status: ssrResult.status,
        headers: {
            "Content-type": "text/html",
            "Cache-Control": cacheControl,
        },
    });
}

async function handler(
    request: Request,
    { path, isRscRequest, language, siteConfig }: { path: string; isRscRequest: boolean; language: string; siteConfig: PublicSiteConfig },
): Promise<Response> {
    // handle server function request
    const isAction = request.method === "POST";
    let returnValue: RscPayload["returnValue"] | undefined;
    let formState: ReactFormState | undefined;
    let temporaryReferences: unknown | undefined;

    if (isAction) {
        // x-rsc-action header exists when action is called via `ReactClient.setServerCallback`.
        const actionId = request.headers.get("x-rsc-action");
        if (actionId) {
            const contentType = request.headers.get("content-type");
            const body = contentType?.startsWith("multipart/form-data") ? await request.formData() : await request.text();
            temporaryReferences = createTemporaryReferenceSet();
            const args = await decodeReply(body, { temporaryReferences });
            const action = await loadServerAction(actionId);
            try {
                // eslint-disable-next-line prefer-spread
                const data = await action.apply(null, args);
                returnValue = { ok: true, data };
            } catch (e) {
                returnValue = { ok: false, data: e };
            }
        } else {
            // otherwise server function is called via `<form action={...}>`
            // before hydration (e.g. when javascript is disabled).
            // aka progressive enhancement.
            const formData = await request.formData();
            const decodedAction = await decodeAction(formData);
            try {
                const result = await decodedAction();
                formState = await decodeFormState(result, formData);
            } catch {
                // there's no single general obvious way to surface this error,
                // so explicitly return classic 500 response.
                return new Response("Internal Server Error: server action failed", {
                    status: 500,
                });
            }
        }
    }

    return cacheLifetimeStorage.run({ time: 450 }, async () => {
        const predefinedPages = await fetchPredefinedPages(siteConfig.scope.domain, language); // cached (=fast)

        // serialization from React VDOM tree to RSC stream.
        // we render RSC stream after handling server function request
        // so that new render reflects updated state from server function call
        // to achieve single round trip to mutate and fetch from server.
        const rscPayload: RscPayload = {
            root: (
                <RouterProvider value={{ path, language, predefinedPages }}>
                    <Root path={path} language={language} siteConfig={siteConfig} />
                </RouterProvider>
            ),
            formState,
            returnValue,
        };
        return renderRscPayload(rscPayload, { path, isRscRequest, temporaryReferences, siteConfig, language });
    });
}

if (import.meta.hot) {
    import.meta.hot.accept();
}

// Augment the default variable map
declare module "hono" {
    interface ContextVariableMap {
        siteConfig: PublicSiteConfig;
    }
}

const app = new Hono();

app.get("/dam/*", (c) => {
    return proxy(process.env.API_URL_INTERNAL + c.req.path);
});

app.get("/api/status", async (c) => {
    return c.json({ status: "OK" });
});

app.get("/admin", async (c) => {
    if (process.env.ADMIN_URL) {
        return c.redirect(process.env.ADMIN_URL);
    }
    c.text("404 Not Found, ADMIN_URL is not set", 404);
});

app.get("/site-preview", async (c) => {
    const jwt = c.req.query("jwt");
    if (!jwt) {
        return c.text("JWT-Parameter is missing.", 400);
    }

    const jwtData = await verifyJwt<SitePreviewJwtPayload>(jwt);
    if (!jwtData) {
        return c.text("JWT-validation failed.", 400);
    }

    const cookieJwt = await new SignJWT({
        scope: jwtData.scope,
        path: jwtData.path,
        previewData: jwtData.previewData,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1 day")
        .sign(new TextEncoder().encode(process.env.SITE_PREVIEW_SECRET));

    setCookie(c, "__comet_preview", cookieJwt, { httpOnly: true, sameSite: "lax" }); // we might be able to simplify this by using setSignedCookie
    return c.redirect(jwtData.path);
});

app.get("/block-preview/:domain/:language/:type", async (c) => {
    const domain = c.req.param("domain");
    const language = c.req.param("language");
    const type = c.req.param("type");
    const siteConfig = await getSiteConfigForDomain(domain);
    c.set("siteConfig", siteConfig);

    const rscPayload: RscPayload = {
        root: (
            <RootLayout scope={{ language, domain }}>
                <BlockPreview type={type} />
            </RootLayout>
        ),
    };
    return renderRscPayload(rscPayload, { path: c.req.path, isRscRequest: false, siteConfig, language });
});

// middleware that resolves siteConfig and site-preview cookie
app.use(async (c, next) => {
    const host = c.req.header("x-forwarded-host") ?? c.req.header("host");
    if (!host) throw new Error("Could not evaluate host");
    const siteConfig = await getSiteConfigForHost(host);
    const previewCookie = getCookie(c, "__comet_preview");
    if (previewCookie || (!siteConfig && host === process.env.PREVIEW_DOMAIN)) {
        if (!previewCookie) {
            return c.text("__comet_preview cookie is missing.", 400);
        }
        const preview = await verifyJwt<SitePreviewParams>(previewCookie);
        if (!preview) {
            return c.text("__comet_preview cookie is invalid.", 400);
        }
        c.set("siteConfig", await getSiteConfigForDomain(preview.scope.domain));
        //do we need it in context in addition to ALS?? c.set("preview", preview);
        await sitePreviewParamsStorage.run(preview, async () => {
            await next();
        });
    } else {
        if (!siteConfig) return c.text("SiteConfig not found.", 400);
        c.set("siteConfig", siteConfig);
        await next();
    }
});

app.get("/robots.txt", (c) => {
    const siteConfig = c.get("siteConfig");
    const robotText = `User-agent: *\n` + `Allow: /\n` + `Sitemap: ${siteConfig.url}/sitemap.xml\n`;
    return c.text(robotText);
});

app.get("/sitemap.xml", sitemapXmlRoute);

app.all("/graphql", (c) => {
    return persistedQueryRoute(c.req.raw, {
        graphqlTarget: `${process.env.API_URL_INTERNAL}/graphql`,
        headers: {
            authorization: `Basic ${Buffer.from(`system-user:${process.env.API_BASIC_AUTH_SYSTEM_USER_PASSWORD}`).toString("base64")}`,
        },
        persistedQueriesPath: ".persisted-queries.json",
        cacheMaxAge: 450,
    });
});
/*
app.get("/", async (c) => {
    return c.redirect("/en");
});
*/
app.on(["GET", "POST"], ["/.rsc/:language/*", "/:language/*", "/*"], async (c) => {
    const isRscRequest = c.req.path.startsWith("/.rsc/");
    const path = c.req.path.replace("/.rsc/", "/").replace(/^\/[^/]+/, "");
    const language = c.req.param("language");
    const siteConfig = c.get("siteConfig");
    return handler(c.req.raw, {
        path,
        isRscRequest,
        language,
        siteConfig,
    });
});
export default app.fetch;
