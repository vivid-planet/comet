import { BlockData, BlockInput, blockInputToData, createBlock } from "@comet/cms-api";

class FullTextSearchBlockData extends BlockData {}

class FullTextSearchBlockInput extends BlockInput {
    transformToBlockData(): FullTextSearchBlockData {
        return blockInputToData(FullTextSearchBlockData, this);
    }
}

export const FullTextSearchBlock = createBlock(FullTextSearchBlockData, FullTextSearchBlockInput, "FullTextSearch");
