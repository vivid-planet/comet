import { renderToReadableStream } from "@vitejs/plugin-rsc/rsc/server";
import type { Context } from "hono";
import type { ReactNode } from "react";

import { NotFoundError, RedirectError } from "./navigation";
import { getRequest, isRscRequest } from "./requestContext";
import { RouterProvider } from "./RouterProvider";

/** React nodes except promises, a promise of these can be rendered as React node */
export type PageContent = Exclude<ReactNode, PromiseLike<unknown>>;

export type RscPayload = {
    root: ReactNode;
};

type RenderPageOptions = {
    /**
     * The page content. Rejects with a `NotFoundError` or `RedirectError` to respond with the not found page or a redirect.
     * Layouts start rendering in parallel to loading the page.
     */
    page: Promise<PageContent>;
    layout: (page: Promise<PageContent>) => ReactNode;
    notFound: () => ReactNode;
    cacheControl: string;
    status?: number;
};

export async function renderPage(c: Context, { page, layout, notFound, cacheControl, status = 200 }: RenderPageOptions): Promise<Response> {
    // Rendering the layout can fail before the page is awaited
    page.catch(() => undefined);

    const url = new URL(getRequest().url);
    const wrapInRouterProvider = (children: ReactNode) => (
        <RouterProvider pathname={url.pathname} search={url.search} params={c.req.param()}>
            {children}
        </RouterProvider>
    );

    const abortController = new AbortController();
    const rscStream = renderRscStream(wrapInRouterProvider(layout(page)), abortController.signal);

    try {
        await page;
    } catch (error) {
        abortController.abort();
        if (error instanceof NotFoundError) {
            return respond(renderRscStream(wrapInRouterProvider(notFound())), { status: 404, cacheControl });
        }
        throw error;
    }

    return respond(rscStream, { status, cacheControl });
}

function renderRscStream(root: ReactNode, signal?: AbortSignal) {
    return renderToReadableStream<RscPayload>(
        { root },
        {
            signal,
            onError(error: unknown) {
                if (signal?.aborted || error instanceof NotFoundError || error instanceof RedirectError) {
                    return;
                }
                console.error(error);
            },
        },
    );
}

async function respond(rscStream: ReadableStream<Uint8Array>, { status, cacheControl }: { status: number; cacheControl: string }) {
    if (isRscRequest()) {
        return new Response(rscStream, {
            status,
            headers: { "Content-Type": "text/x-component;charset=utf-8", "Cache-Control": cacheControl },
        });
    }

    const ssrEntry = await import.meta.viteRsc.loadModule<typeof import("./entry.ssr")>("ssr", "index");
    const html = await ssrEntry.renderHtml(rscStream);

    return new Response(html.stream, {
        status: html.status ?? status,
        headers: { "Content-Type": "text/html;charset=utf-8", "Cache-Control": cacheControl },
    });
}
