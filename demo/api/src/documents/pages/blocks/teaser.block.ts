import { createListBlock } from "@comet/blocks-api";

import { TeaserItemBlock } from "./teaser-item.block";

export const TeaserBlock = createListBlock({ block: TeaserItemBlock }, "Teaser");
