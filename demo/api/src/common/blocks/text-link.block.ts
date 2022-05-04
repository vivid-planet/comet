import { createTextLinkBlock } from "@comet/api-blocks";

import { LinkBlock } from "./linkBlock/link.block";

export const TextLinkBlock = createTextLinkBlock({ link: LinkBlock });
