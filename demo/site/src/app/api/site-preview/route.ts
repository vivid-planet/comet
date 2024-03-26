import { SitePreviewParams } from "@comet/cms-site";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;

    //TODO const params = await getValidatedSitePreviewParams(req, res, createGraphQLClient());

    // You might want to store params.scope now
    draftMode().enable();

    redirect(params.get("path") || "/");
}

export type PreviewData = SitePreviewParams["settings"];
