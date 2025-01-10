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
        return res.status(400).json({ error: "JWT-Parameter is missing." });
    }

    const data = await verifySitePreviewJwt(jwt);
    if (!data) {
        return res.status(400).json({ error: "JWT-validation failed." });
    }

    res.setPreviewData(data);
    res.redirect(data.path);
}

export { legacyPagesRouterSitePreviewApiHandler };
