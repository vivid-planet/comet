import { createListBlock } from "@comet/cms-api";

import { TeaserItemBlock } from "./teaser-item.block";

export const TeaserBlock = createListBlock({ block: TeaserItemBlock }, "Teaser");
