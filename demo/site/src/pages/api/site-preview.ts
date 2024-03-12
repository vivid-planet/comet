import { getValidatedSitePreviewParams } from "@comet/cms-site";
import { createGraphQLClient } from "@src/util/graphQLClient";

export default async function handler(req, res) {
    const params = await getValidatedSitePreviewParams(req, res, createGraphQLClient());

    // You might want to store params.scope now
    res.setPreviewData(params.settings);

    res.redirect(params.path);
}
