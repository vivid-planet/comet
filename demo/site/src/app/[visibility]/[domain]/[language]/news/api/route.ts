import { fetchNewsList } from "@src/news/NewsPage.loader";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { PageParams } from "../page";

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
    return NextResponse.json(data);
}
