import { NextApiRequest, NextApiResponse } from "next";

import { verifySitePreviewJwt } from "../SitePreviewUtils";

async function legacyPagesRouterSitePreviewApiHandler(
    req: NextApiRequest,
    res: NextApiResponse,
    _graphQLClient: unknown /* deprecated: remove argument in v8 */,
) {
    const params = req.query;
    const jwt = params.jwt;

    if (typeof jwt !== "string") {
        throw new Error("Missing jwt parameter");
    }

    const data = await verifySitePreviewJwt(jwt);

    res.setPreviewData(data);
    res.redirect(data.path);
}

export { legacyPagesRouterSitePreviewApiHandler };
