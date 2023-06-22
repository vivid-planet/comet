import { createListBlock } from "@comet/blocks-api";

import { DebugBlock } from "./debug.block";

export const DebugListBlock = createListBlock({ block: DebugBlock }, "DebugList");
