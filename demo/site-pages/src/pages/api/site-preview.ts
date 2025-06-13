import { legacyPagesRouterSitePreviewApiHandler } from "@comet/cms-site";
import { createGraphQLClient } from "@src/util/createGraphQLClient";
import { NextApiHandler } from "next";

const SitePreviewApiHandler: NextApiHandler = async (req, res) => {
    await legacyPagesRouterSitePreviewApiHandler(req, res, createGraphQLClient());
};

export default SitePreviewApiHandler;
