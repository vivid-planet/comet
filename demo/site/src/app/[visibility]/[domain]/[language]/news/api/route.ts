import { fetchNewsList } from "@src/news/NewsPage.loader";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { type PageParams } from "../page";

export async function GET(request: NextRequest, { params: { domain, language } }: { params: PageParams }) {
    const result = z
        .object({
            offset: z.coerce.number().min(0),
            limit: z.coerce.number().min(1).max(100),
        })
        .safeParse(Object.fromEntries(request.nextUrl.searchParams));

    if (!result.success) {
        return NextResponse.json({ issues: result.error.issues, message: "Validation failed" }, { status: 400 });
    }

    const data = await fetchNewsList({
        scope: { domain, language },
        ...result.data,
    });

    // 7.5 min (CDN) + 7.5 min (Data Cache) = 15 min effective cache duration
    return NextResponse.json(data, {
        headers: {
            "Cache-Control": "public, max-age=450, stale-while-revalidate=450",
        },
        status: 200,
    });
}
