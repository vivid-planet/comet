import { createTextLinkBlock } from "@comet/cms-api";

import { LinkBlock } from "./linkBlock/link.block";

export const TextLinkBlock = createTextLinkBlock({ link: LinkBlock }, "DemoTextLink");
