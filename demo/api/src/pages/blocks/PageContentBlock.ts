import {
    BaseBlocksBlockItemData,
    BaseBlocksBlockItemInput,
    BlockContext,
    BlockField,
    createBlocksBlock,
    SpaceBlock,
    TransformDependencies,
    TraversableTransformResponse,
    YouTubeVideoBlock,
} from "@comet/blocks-api";
import { DamImageBlock, DamVideoBlock } from "@comet/cms-api";
import { LinkListBlock } from "@src/common/blocks/link-list.block";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { UserGroup } from "@src/user-groups/user-group";
import { plainToClass } from "class-transformer";
import { IsEnum } from "class-validator";

import { ColumnsBlock } from "./columns.block";
import { FullWidthImageBlock } from "./full-width-image.block";
import { HeadlineBlock } from "./headline.block";
import { TextImageBlock } from "./TextImageBlock";

const supportedBlocks = {
    space: SpaceBlock,
    richtext: RichTextBlock,
    headline: HeadlineBlock,
    image: DamImageBlock,
    textImage: TextImageBlock,
    damVideo: DamVideoBlock,
    youTubeVideo: YouTubeVideoBlock,
    linkList: LinkListBlock,
    fullWidthImage: FullWidthImageBlock,
    columns: ColumnsBlock,
};

class BlocksBlockItemData extends BaseBlocksBlockItemData(supportedBlocks) {
    @BlockField({ type: "enum", enum: UserGroup })
    userGroup: UserGroup;

    async transformToPlain(deps: TransformDependencies, context: BlockContext): Promise<TraversableTransformResponse> {
        return {
            ...(await super.transformToPlain(deps, context)),
            userGroup: this.userGroup,
        };
    }
}

class BlocksBlockItemInput extends BaseBlocksBlockItemInput(supportedBlocks, BlocksBlockItemData) {
    @BlockField({ type: "enum", enum: UserGroup })
    @IsEnum(UserGroup)
    userGroup: UserGroup;

    transformToBlockData(): BlocksBlockItemData {
        return plainToClass(BlocksBlockItemData, {
            ...super.transformToBlockData(),
            userGroup: this.userGroup,
        });
    }
}

export const PageContentBlock = createBlocksBlock(
    {
        supportedBlocks,
        BlocksBlockItemData,
        BlocksBlockItemInput,
    },
    "PageContent",
);
