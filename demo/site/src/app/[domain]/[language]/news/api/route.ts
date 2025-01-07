import { GQLNewsCategory } from "@src/graphql.generated";
import { fetchNewsList } from "@src/news/NewsList.loader";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params: { domain, language } }: { params: { domain: string; language: string } }) {
    const data = await fetchNewsList({
        scope: { domain, language },
        category: (request.nextUrl.searchParams.get("category") as GQLNewsCategory) || undefined,
    });
    return NextResponse.json(data);
}
