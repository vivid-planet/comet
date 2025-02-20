import { IsOptional, IsString } from "class-validator";

import { Block, BlockDataInterface, BlockInputInterface } from "../block";
import { BlockField } from "../decorators/field";
import { BlockFactoryNameOrOptions } from ".//types";
import {
    BaseOneOfBlockData,
    BaseOneOfBlockInput,
    BaseOneOfBlockItemData,
    BaseOneOfBlockItemInput,
    createOneOfBlock,
    CreateOneOfBlockOptions,
} from "./createOneOfBlock";

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
