import { BlockData, BlockField, BlockIndexData, BlockInput, createBlock, inputToData } from "@comet/blocks-api";
import { IsOptional, IsUUID } from "class-validator";

class NewsDetailBlockData extends BlockData {
    @BlockField({ nullable: true })
    id?: string;

    indexData(): BlockIndexData {
        if (this.id === undefined) {
            return {};
        }

        return {
            dependencies: [
                {
                    targetEntityName: "News",
                    id: this.id,
                },
            ],
        };
    }
}

class NewsDetailBlockInput extends BlockInput {
    @BlockField({ nullable: true })
    @IsUUID()
    @IsOptional()
    id?: string;

    transformToBlockData(): NewsDetailBlockData {
        return inputToData(NewsDetailBlockData, this);
    }
}

const NewsDetailBlock = createBlock(NewsDetailBlockData, NewsDetailBlockInput, "NewsDetail");

export { NewsDetailBlock };
