import { createListBlock } from "@comet/cms-api";
import { KeyFactsItemBlock } from "@src/documents/pages/blocks/key-facts-item.block";

export const KeyFactsBlock = createListBlock({ block: KeyFactsItemBlock }, "KeyFacts");
