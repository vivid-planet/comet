import { BlockData, BlockField, BlockIndexData, BlockInput, createBlock, inputToData } from "@comet/blocks-api";
import { News } from "@src/news/entities/news.entity";
import { IsOptional, IsUUID } from "class-validator";

class NewsLinkBlockData extends BlockData {
    @BlockField({ nullable: true })
    id?: string;

    indexData(): BlockIndexData {
        return {
            dependencies: [
                {
                    targetEntityName: News.name,
                    id: this.id,
                },
            ],
        };
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
