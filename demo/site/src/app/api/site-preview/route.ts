import { getValidatedSitePreviewParams, SitePreviewParams } from "@comet/cms-site";
import createGraphQLClient from "@src/util/createGraphQLClient";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    let params: SitePreviewParams;
    try {
        params = await getValidatedSitePreviewParams(request, createGraphQLClient());
    } catch (e) {
        return new Response(e.message, { status: 403 });
    }

    // You might want to store params.scope now
    draftMode().enable();

    redirect(params.path);
}

export type PreviewData = SitePreviewParams["settings"];
