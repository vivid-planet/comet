import {
    BaseOneOfBlockData,
    BaseOneOfBlockInput,
    BaseOneOfBlockItemData,
    BaseOneOfBlockItemInput,
    Block,
    BlockDataInterface,
    BlockFactoryNameOrOptions,
    BlockField,
    BlockInputInterface,
    createOneOfBlock,
    CreateOneOfBlockOptions,
} from "@comet/blocks-api";
import { IsOptional, IsString } from "class-validator";

function createLinkBlock<BlockMap extends Record<string, Block<BlockDataInterface, BlockInputInterface>>>(
    { supportedBlocks, allowEmpty = false }: CreateOneOfBlockOptions<BlockMap>,
    nameOrOptions: BlockFactoryNameOrOptions = "Link",
) {
    class LinkBlockItemData extends BaseOneOfBlockItemData({ supportedBlocks }) {}

    class LinkBlockItemInput extends BaseOneOfBlockItemInput({ supportedBlocks, OneOfBlockItemData: LinkBlockItemData }) {}

    class LinkBlockData extends BaseOneOfBlockData({ supportedBlocks, OneOfBlockItemData: LinkBlockItemData }) {
        @BlockField({ nullable: true })
        title?: string;
    }

    class LinkBlockInput extends BaseOneOfBlockInput({
        supportedBlocks,
        allowEmpty,
        OneOfBlockData: LinkBlockData,
        OneOfBlockItemInput: LinkBlockItemInput,
    }) {
        @BlockField({ nullable: true })
        @IsOptional()
        @IsString()
        title?: string;
    }

    return createOneOfBlock({ supportedBlocks, allowEmpty, OneOfBlockData: LinkBlockData, OneOfBlockInput: LinkBlockInput }, nameOrOptions);
}

export { createLinkBlock };
