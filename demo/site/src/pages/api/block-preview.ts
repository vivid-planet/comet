import { getValidatedBlockPreviewParams } from "@comet/cms-site";
import createGraphQLClient from "@src/util/createGraphQLClient";

export default async function handler(req, res) {
    const params = await getValidatedBlockPreviewParams(req, res, createGraphQLClient());
    // You might want to store the contentScope of the current request now

    res.redirect(params.path);
}
