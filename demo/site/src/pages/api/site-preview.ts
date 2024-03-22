import { getValidatedSitePreviewParams, SitePreviewParams } from "@comet/cms-site";
import createGraphQLClient from "@src/util/createGraphQLClient";

export default async function handler(req, res) {
    const params = await getValidatedSitePreviewParams(req, res, createGraphQLClient());

    // You might want to store params.scope now
    res.setPreviewData(params.settings);

    res.redirect(params.path);
}

export type PreviewData = SitePreviewParams["settings"];
