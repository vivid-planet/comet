import { legacyPagesRouterBlockPreviewApiHandler } from "@comet/site-nextjs";
import { type NextApiHandler } from "next";

const BlockPreviewApiHandler: NextApiHandler = async (req, res) => {
    await legacyPagesRouterBlockPreviewApiHandler(req, res);
};

export default BlockPreviewApiHandler;
