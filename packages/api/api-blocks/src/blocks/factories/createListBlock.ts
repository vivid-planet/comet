import { plainToClass, Transform, Type } from "class-transformer";
import { Allow, IsBoolean, IsString, ValidateNested } from "class-validator";

import {
    Block,
    BlockContext,
    BlockData,
    BlockDataInterface,
    BlockInput,
    BlockInputInterface,
    ChildBlockInfo,
    createBlock,
    ExtractBlockInput,
    isBlockDataInterface,
    isBlockInputInterface,
    SimpleBlockInputInterface,
    TraversableTransformResponse,
} from "../block";
import { BlockField } from "../decorators/field";
import { TransformDependencies } from "../dependencies";
import { NameOrOptions } from "./types";

interface Options<B extends Block> {
    block: B;
}

export interface ListBlockInputInterface<B extends BlockInputInterface> extends SimpleBlockInputInterface {
    blocks: Array<
        {
            key: string;
            visible: boolean;
            props: B;
        } & SimpleBlockInputInterface
    >;
}

export function createListBlock<B extends Block>(
    { block }: Options<B>,
    name: NameOrOptions,
): Block<BlockDataInterface, ListBlockInputInterface<ExtractBlockInput<B>>> {
    if (!block) throw new Error("block is undefined (can happen because of cycling imports)");

    class BlockBlockListItem extends BlockData {
        @BlockField()
        key: string;

        @BlockField()
        visible: boolean;

        @Transform(
            (value) => {
                return isBlockDataInterface(value) ? value : block.blockDataFactory(value);
            },
            { toClassOnly: true },
        )
        @BlockField(block)
        props: BlockDataInterface;

        async transformToPlain(deps: TransformDependencies, { includeInvisibleContent }: BlockContext): Promise<TraversableTransformResponse> {
            return {
                key: this.key,
                visible: this.visible,
                props: includeInvisibleContent || this.visible ? this.props : {},
            };
        }
    }

    class BlockBlockList extends BlockData {
        @Type(() => BlockBlockListItem)
        @BlockField(BlockBlockListItem)
        blocks: BlockBlockListItem[];

        async transformToPlain(deps: TransformDependencies, { includeInvisibleContent }: BlockContext): Promise<TraversableTransformResponse> {
            return {
                blocks: includeInvisibleContent ? this.blocks : this.blocks.filter((c) => c.visible),
            };
        }

        childBlocksInfo(): ChildBlockInfo[] {
            return this.blocks.map((childBlock, index) => ({
                visible: childBlock.visible,
                relJsonPath: ["blocks", index, "props"],
                block: childBlock.props,
                name: block.name,
            }));
        }
    }

    class BlockBlockListItemInput<Input extends BlockInputInterface> extends BlockInput {
        @Allow()
        @IsString()
        @BlockField()
        key: string;

        @IsBoolean()
        @BlockField()
        visible: boolean;

        @Transform(
            (value) => {
                return isBlockInputInterface(value) ? value : block.blockInputFactory(value);
            },
            { toClassOnly: true },
        )
        @ValidateNested()
        @BlockField(block)
        props: Input;

        transformToBlockData(): BlockBlockListItem {
            return plainToClass(BlockBlockListItem, {
                ...this,
                key: this.key,
                visible: this.visible,
                props: this.props.transformToBlockData(),
            });
        }
    }

    class BlockBlockListInput extends BlockInput {
        @Type(() => BlockBlockListItemInput)
        @ValidateNested({ each: true })
        @BlockField(BlockBlockListItemInput)
        blocks: BlockBlockListItemInput<ExtractBlockInput<B>>[];

        transformToBlockData(): BlockBlockList {
            return plainToClass(BlockBlockList, {
                ...this,
                blocks: this.blocks.map((block) => block.transformToBlockData()),
            });
        }
    }

    return createBlock(BlockBlockList, BlockBlockListInput, name);
}
