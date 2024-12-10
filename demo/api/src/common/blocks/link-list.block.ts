import { createListBlock } from "@comet/blocks-api";

import { TextLinkBlock } from "./text-link.block";

export const LinkListBlock = createListBlock({ block: TextLinkBlock }, "LinkList");
