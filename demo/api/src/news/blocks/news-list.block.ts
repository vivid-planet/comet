import { BlockData, BlockField, BlockInput, createBlock, inputToData } from "@comet/blocks-api";
import { IsUUID } from "class-validator";

export class NewsListBlockData extends BlockData {
    @BlockField({ type: "string", array: true })
    ids: string[];
}

class NewsListBlockInput extends BlockInput {
    @BlockField({ type: "string", array: true })
    @IsUUID(undefined, { each: true })
    ids: string[];

    transformToBlockData(): NewsListBlockData {
        return inputToData(NewsListBlockData, this);
    }
}

export const NewsListBlock = createBlock(NewsListBlockData, NewsListBlockInput, "NewsList");
