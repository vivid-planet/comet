import jsonwebtoken from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export function handlePreviewApiRequest(req: NextApiRequest, res: NextApiResponse) {
    if (!process.env.SITE_PREVIEW_SECRET) throw new Error("process.env.SITE_PREVIEW_SECRET is required");
    if (!req.query["jwt"]) throw new Error("jwt is required");

    const data = jsonwebtoken.verify(req.query["jwt"].toString(), process.env.SITE_PREVIEW_SECRET) as {
        path: string;
        previewData: PreviewData;
    };
    res.setPreviewData(data.previewData);
    res.redirect(data.path);
}

export type PreviewData = {
    includeInvisible: boolean;
};
