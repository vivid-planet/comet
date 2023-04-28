import { BlockData, BlockField, BlockIndexData, BlockInput, createBlock, inputToData } from "@comet/blocks-api";
import { IsOptional, IsUUID } from "class-validator";

class NewsLinkBlockData extends BlockData {
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
