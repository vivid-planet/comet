import { persistedQueryRoute } from "@comet/site-nextjs";

export const dynamic = "force-dynamic";

async function handler(request: Request) {
    return persistedQueryRoute(request, {
        graphqlTarget: `${process.env.API_URL_INTERNAL}/graphql`,
        headers: {
            authorization: `Basic ${Buffer.from(`system-user:${process.env.API_BASIC_AUTH_SYSTEM_USER_PASSWORD}`).toString("base64")}`,
        },
        persistedQueriesPath: ".next/persisted-queries.json",
    });
}

export { handler as GET, handler as POST };
