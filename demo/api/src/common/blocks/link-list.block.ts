import { createListBlock } from "@comet/api-blocks";

import { TextLinkBlock } from "./text-link.block";

export const LinkListBlock = createListBlock({ block: TextLinkBlock }, "LinkList");
