import { legacyPagesRouterSitePreviewApiHandler } from "@comet/site-nextjs";
import { type NextApiHandler } from "next";

const SitePreviewApiHandler: NextApiHandler = async (req, res) => {
    await legacyPagesRouterSitePreviewApiHandler(req, res);
};

export default SitePreviewApiHandler;
