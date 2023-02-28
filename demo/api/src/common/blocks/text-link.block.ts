import { createTextLinkBlock } from "@comet/blocks-api";

import { LinkBlock } from "./linkBlock/link.block";

export const TextLinkBlock = createTextLinkBlock({ link: LinkBlock }, "DemoTextLink");
