import { type NextApiRequest, type NextApiResponse } from "next";

import { type BlockPreviewParams, verifyJwt } from "../previewUtils";

async function legacyPagesRouterBlockPreviewApiHandler(req: NextApiRequest, res: NextApiResponse) {
    const params = req.query;
    const jwt = params.jwt;

    if (typeof jwt !== "string") {
        return res.status(400).json({ error: "JWT-Parameter is missing." });
    }

    const data = await verifyJwt<BlockPreviewParams>(jwt);
    if (!data) {
        return res.status(400).json({ error: "JWT-validation failed." });
    }

    res.setPreviewData(data);
    res.redirect(data.url);
}

export { legacyPagesRouterBlockPreviewApiHandler };
