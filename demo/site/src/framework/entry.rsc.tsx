import { app } from "@src/handler";

import { runWithRequestContext } from "./requestContext";
import { rscPathnameSuffix, stripRscSuffix } from "./rscRequest";

async function handler(request: Request): Promise<Response> {
    const strippedUrl = stripRscSuffix(new URL(request.url));
    const isRscRequest = strippedUrl !== null;
    if (strippedUrl) {
        request = new Request(strippedUrl, { method: request.method, headers: request.headers, signal: request.signal });
    }

    const response = await runWithRequestContext({ request, isRscRequest }, () => app.fetch(request));

    const location = response.headers.get("Location");
    if (isRscRequest && location?.startsWith("/") && !location.startsWith("//")) {
        // Keep following redirects as RSC requests, the browser entry strips the suffix from the final URL
        const redirectUrl = new URL(location, request.url);
        redirectUrl.pathname += rscPathnameSuffix;
        const redirectResponse = new Response(response.body, response);
        redirectResponse.headers.set("Location", `${redirectUrl.pathname}${redirectUrl.search}`);
        return redirectResponse;
    }

    return response;
}

export default { fetch: handler };

if (import.meta.hot) {
    import.meta.hot.accept();
}
