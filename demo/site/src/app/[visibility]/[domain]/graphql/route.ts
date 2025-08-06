import { queryMap } from "@src/queryMap.generated";

const GRAPHQL_TARGET = `${process.env.API_URL_INTERNAL}/graphql`;

async function handler(req: Request) {
    let hash: string | null | undefined;
    let variables: unknown;

    if (req.method === "POST") {
        const body = await req.json();
        hash = body.extensions?.persistedQuery?.sha256Hash;
        variables = body.variables;
    } else if (req.method === "GET") {
        const url = new URL(req.url);
        hash = url.searchParams.get("extensions.persistedQuery.sha256Hash");
        const variablesParam = url.searchParams.get("variables");
        variables = variablesParam ? JSON.parse(variablesParam) : undefined;
    } else {
        return Response.json({ error: "MethodNotAllowed" }, { status: 405 });
    }

    // Only allow persisted queries
    if (!hash) {
        return Response.json({ error: "OnlyPersistedQueriesAllowed" }, { status: 400 });
    }

    const finalQuery = queryMap[hash];

    if (!finalQuery) {
        return Response.json({ error: "PersistedQueryNotFound", hash }, { status: 400 });
    }

    // CSRF protection for GET requests, similar to Apollo Server's CSRF protection
    if (req.method === "GET") {
        const apolloPreflight = req.headers.get("Apollo-Require-Preflight");
        if (apolloPreflight !== "true") {
            return Response.json({ error: "CSRFProtection", message: "Missing Apollo-Require-Preflight header" }, { status: 403 });
        }
    }

    // Forward to actual GraphQL server
    const upstreamRes = await fetch(GRAPHQL_TARGET, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: finalQuery, variables }),
    });

    const text = await upstreamRes.text();

    const responseHeaders: Record<string, string> = {
        "Content-Type": "application/json",
    };
    if (req.method === "GET") {
        // Cache for 7.5 minutes (450 seconds) in CDNs and browsers
        responseHeaders["Cache-Control"] = "public, max-age=450";
    }

    return new Response(text, {
        status: upstreamRes.status,
        headers: responseHeaders,
    });
}

export { handler as GET, handler as POST };
