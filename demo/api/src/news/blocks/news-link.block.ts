import { BlockData, BlockField, BlockIndexDataArray, BlockInput, createBlock, inputToData } from "@comet/blocks-api";
import { NEWS_BLOCK_INDEX_IDENTIFIER } from "@src/news/entities/news.entity";
import { IsOptional, IsUUID } from "class-validator";

class NewsLinkBlockData extends BlockData {
    @BlockField({ nullable: true })
    id?: string;

    indexData(): BlockIndexDataArray {
        return [
            {
                targetIdentifier: NEWS_BLOCK_INDEX_IDENTIFIER,
                id: this.id,
            },
        ];
    }
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
