import { createFromReadableStream, getClientEntryUrl } from "@vitejs/plugin-rsc/ssr";
import { use } from "react";
import { renderToReadableStream } from "react-dom/server.edge";
import { injectRSCPayload } from "rsc-html-stream/server";

import { getNavigationErrorDigest } from "./navigation";
import type { RscPayload } from "./render";

export { renderBrevoEmailCampaign } from "@src/app/api/render-brevo-email-campaign";
export { renderWelcomeEmail } from "@src/app/api/render-welcome-email";

type RenderHtmlResult =
    | { stream: ReadableStream<Uint8Array>; status?: number }
    /** `notFound()` or `redirect()` was called by a client component */
    | { navigationDigest: string };

export async function renderHtml(rscStream: ReadableStream<Uint8Array>): Promise<RenderHtmlResult> {
    const [ssrRscStream, browserRscStream] = rscStream.tee();

    let payload: Promise<RscPayload> | undefined;
    function SsrRoot() {
        // Deserialization must start inside the React DOM render for preloading (e.g. of client component CSS) to work
        payload ??= createFromReadableStream<RscPayload>(ssrRscStream);
        return use(payload).root;
    }

    let htmlStream: ReadableStream<Uint8Array>;
    try {
        htmlStream = await renderToReadableStream(<SsrRoot />, {
            bootstrapScriptContent: `import(${JSON.stringify(getClientEntryUrl())})`,
            onError(error: unknown) {
                const digest = getNavigationErrorDigest(error);
                if (digest) {
                    return digest;
                }
                console.error(error);
                return undefined;
            },
        });
    } catch (error) {
        await browserRscStream.cancel();
        const navigationDigest = getNavigationErrorDigest(error);
        if (navigationDigest) {
            return { navigationDigest };
        }
        return {
            stream: new Response("Internal Server Error").body as ReadableStream<Uint8Array>,
            status: 500,
        };
    }

    // The RSC payload is embedded into the HTML for hydration
    return { stream: htmlStream.pipeThrough(injectRSCPayload(browserRscStream)) };
}

if (import.meta.hot) {
    import.meta.hot.accept();
}
