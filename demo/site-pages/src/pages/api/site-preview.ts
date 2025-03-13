import { legacyPagesRouterSitePreviewApiHandler } from "@comet/cms-site";
import { type NextApiHandler } from "next";

const SitePreviewApiHandler: NextApiHandler = async (req, res) => {
    await legacyPagesRouterSitePreviewApiHandler(req, res);
};

export default SitePreviewApiHandler;
