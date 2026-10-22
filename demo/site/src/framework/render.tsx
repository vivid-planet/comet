import { renderToReadableStream } from "@vitejs/plugin-rsc/rsc/server";
import type { Context } from "hono";
import type { ReactNode } from "react";

import { getNavigationErrorDigest, isNotFoundDigest, parseRedirectDigest } from "./navigation";
import { getRequest, isRscRequest } from "./requestContext";
import { RouterProvider } from "./RouterProvider";

export type RscPayload = {
    root: ReactNode;
};

type RenderPageOptions = {
    root: ReactNode;
    /** Rendered with status 404 when `notFound()` is called while rendering `root` */
    notFound: () => ReactNode;
    cacheControl: string;
    status?: number;
};

export async function renderPage(c: Context, { root, notFound, cacheControl, status = 200 }: RenderPageOptions): Promise<Response> {
    const url = new URL(getRequest().url);
    const rscPayload = await renderRscPayload(
        <RouterProvider pathname={url.pathname} search={url.search} params={c.req.param()}>
            {root}
        </RouterProvider>,
    );

    const result = rscPayload.navigationDigest
        ? { navigationDigest: rscPayload.navigationDigest }
        : await respond(rscPayload.chunks, { status, cacheControl });
    if ("response" in result) {
        return result.response;
    }

    const redirect = parseRedirectDigest(result.navigationDigest);
    if (redirect) {
        return c.redirect(redirect.location, redirect.status);
    }
    if (isNotFoundDigest(result.navigationDigest) && status !== 404) {
        return renderPage(c, { root: notFound(), notFound, cacheControl, status: 404 });
    }
    throw new Error("notFound() must not be called while rendering the not found page");
}

async function renderRscPayload(root: ReactNode) {
    let navigationDigest: string | undefined;
    const stream = renderToReadableStream<RscPayload>(
        { root },
        {
            onError(error: unknown) {
                const digest = getNavigationErrorDigest(error);
                if (digest) {
                    navigationDigest ??= digest;
                    return digest;
                }
                console.error(error);
                return undefined;
            },
        },
    );

    // The payload is rendered completely before responding, so that notFound() and redirect() can set the status,
    // no matter where in the tree they are called
    const chunks: Uint8Array[] = [];
    const reader = stream.getReader();
    for (let result = await reader.read(); !result.done; result = await reader.read()) {
        chunks.push(result.value);
    }

    return { chunks, navigationDigest };
}

function createStream(chunks: Uint8Array[]) {
    return new ReadableStream<Uint8Array>({
        start(controller) {
            for (const chunk of chunks) {
                controller.enqueue(chunk);
            }
            controller.close();
        },
    });
}

async function respond(
    rscChunks: Uint8Array[],
    { status, cacheControl }: { status: number; cacheControl: string },
): Promise<{ response: Response } | { navigationDigest: string }> {
    if (isRscRequest()) {
        return {
            response: new Response(createStream(rscChunks), {
                status,
                headers: {
                    "Content-Type": "text/x-component;charset=utf-8",
                    "Cache-Control": cacheControl,
                    // Crawlers only need the HTML, the RSC payload for hydration is embedded in it
                    "X-Robots-Tag": "noindex",
                },
            }),
        };
    }

    const ssrEntry = await import.meta.viteRsc.loadModule<typeof import("./entry.ssr")>("ssr", "index");
    const html = await ssrEntry.renderHtml(createStream(rscChunks));
    if ("navigationDigest" in html) {
        return html;
    }

    return {
        response: new Response(html.stream, {
            status: html.status ?? status,
            headers: { "Content-Type": "text/html;charset=utf-8", "Cache-Control": cacheControl },
        }),
    };
}
