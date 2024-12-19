import { createListBlock } from "@comet/blocks-api";

import { KeyFactsItemBlock } from "./key-facts-item.block";

export const KeyFactsBlock = createListBlock({ block: KeyFactsItemBlock }, "KeyFacts");
