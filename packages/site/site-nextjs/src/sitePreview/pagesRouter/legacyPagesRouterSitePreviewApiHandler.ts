import { type NextApiRequest, type NextApiResponse } from "next";

import { type SitePreviewParams, verifyJwt } from "../SitePreviewUtils";

async function legacyPagesRouterSitePreviewApiHandler(req: NextApiRequest, res: NextApiResponse) {
    const params = req.query;
    const jwt = params.jwt;

    if (typeof jwt !== "string") {
        return res.status(400).json({ error: "JWT-Parameter is missing." });
    }

    const data = await verifyJwt<SitePreviewParams>(jwt);
    if (!data) {
        return res.status(400).json({ error: "JWT-validation failed." });
    }

    res.setPreviewData(data);
    res.redirect(data.path);
}

export { legacyPagesRouterSitePreviewApiHandler };
