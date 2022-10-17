import { BlockData, BlockField, BlockInput, createBlock, inputToData } from "@comet/blocks-api";
import { IsOptional, IsUUID } from "class-validator";

class NewsLinkBlockData extends BlockData {
    @BlockField({ nullable: true })
    id?: string;
}

class NewsLinkBlockInput extends BlockInput {
    @BlockField({ nullable: true })
    @IsUUID()
    @IsOptional()
    id?: string;

    transformToBlockData(): NewsLinkBlockData {
        return inputToData(NewsLinkBlockData, this);
    }
}

const NewsLinkBlock = createBlock(NewsLinkBlockData, NewsLinkBlockInput, "NewsLink");

export { NewsLinkBlock };
