import { readFile } from "fs/promises";

let queryMap: Record<string, string> | undefined;
async function loadQuery(hash: string): Promise<string | null> {
    if (!queryMap) {
        const file = await readFile(".next/persisted-queries.json", "utf-8");
        queryMap = JSON.parse(file.toString());
    }
    return queryMap![hash] || null;
}

let fragmentsMap: Record<string, string> | undefined;
function injectFragments(query: string) {
    if (!fragmentsMap) {
        fragmentsMap = {};
        for (const [, query] of Object.entries(queryMap!)) {
            const match = query.match(/^\s*fragment\s+(\w+)\s+on\s+\w+/m);
            if (match) {
                const fragmentName = match[1];
                fragmentsMap[fragmentName] = query.replaceAll(/\${.*?}/g, ""); // remove interpolations that would be injected at runtime;
            }
        }
    }
    query = query.replaceAll(/\${.*?}/g, ""); // remove interpolations that would be injected at runtime

    const injected = new Set<string>();
    query.matchAll(/^\s*fragment\s+(\w+)\s+on\s+\w+/m).forEach((m) => injected.add(m[1])); // fragments in the initial query
    function inject(q: string): string {
        // Find all fragment spreads in the query
        const spreads = Array.from(q.matchAll(/\.\.\.(\w+)/g)).map((m) => m[1]);
        let result = q;
        for (const fragmentName of spreads) {
            if (!injected.has(fragmentName) && fragmentsMap![fragmentName]) {
                injected.add(fragmentName);
                // Recursively inject fragments used by this fragment
                result += "\n" + inject(fragmentsMap![fragmentName]);
            }
        }
        return result;
    }
    query = inject(query);


    return query;
}

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

    let query = await loadQuery(hash);
    if (!query) {
        return Response.json({ error: "PersistedQueryNotFound", hash }, { status: 400 });
    }
    query = injectFragments(query);

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
        body: JSON.stringify({ query: query, variables }),
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
