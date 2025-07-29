import { createBlocksBlock } from "../../../../factories/createBlocksBlock";
import { BBlock } from "./BBlock";

export const ABlock = createBlocksBlock({ supportedBlocks: { b: BBlock, b2: BBlock } }, "ABlocksBlock");
