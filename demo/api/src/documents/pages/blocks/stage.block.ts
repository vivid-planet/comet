import { createListBlock } from "@comet/blocks-api";

import { BasicStageBlock } from "./basic-stage.block";

/* If you need multiple stage blocks, you should use createBlocksBlock instead of createListBlock */
export const StageBlock = createListBlock({ block: BasicStageBlock }, "Stage");