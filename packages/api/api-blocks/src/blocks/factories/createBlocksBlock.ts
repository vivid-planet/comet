import { plainToClass, Transform } from "class-transformer";
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
    ExtractBlockInputFactoryProps,
    isBlockDataInterface,
    isBlockInputInterface,
    SimpleBlockInputInterface,
    TraversableTransformResponse,
} from "../block";
import { BlockField } from "../decorators/field";
import { TransformDependencies } from "../dependencies";
import { NameOrOptions } from "./types";

type BaseBlockMap = Record<string, Block>;

interface Options<BlockMap extends BaseBlockMap> {
    supportedBlocks: BlockMap;
}

export interface BlocksBlockInputInterface<BlockMap extends BaseBlockMap> extends SimpleBlockInputInterface {
    blocks: SupportedBlocksInputInterfaces<BlockMap>[];
}

type SupportedBlocksInputInterfaces<BlockMap extends BaseBlockMap> = {
    [Typename in keyof BlockMap]: SimpleBlockInputInterface & {
        key: string;
        visible: boolean;
        type: Typename;
        props: ExtractBlockInput<BlockMap[Typename]>;
    };
}[keyof BlockMap]; // https://effectivetypescript.com/2020/05/12/unionize-objectify/

export function createBlocksBlock<BlockMap extends BaseBlockMap>(
    { supportedBlocks }: Options<BlockMap>,
    nameOrOptions: NameOrOptions,
): Block<BlockDataInterface, BlocksBlockInputInterface<BlockMap>> {
    if (Object.keys(supportedBlocks).length === 0) {
        throw new Error("Blocks block with no supported block is not allowed. Please specify at least two supported blocks.");
    }

    if (Object.keys(supportedBlocks).length === 1) {
        throw new Error("Blocks block with a single block is not allowed. Please use a list block (createListBlock()) instead.");
    }

    for (const blk in supportedBlocks) {
        if (!supportedBlocks[blk]) throw new Error(`block '${blk}' is undefined (can happen because of cycling imports)`);
    }
    class BlockBlocksItem extends BlockData {
        @BlockField()
        key: string;

        @BlockField()
        visible: boolean;

        @BlockField()
        type: string;

        @Transform(
            (value, obj) => {
                const blockType = obj.type as string;
                const block = supportedBlocks[blockType];

                if (!block) {
                    throw new Error(`unknown type ${blockType}`);
                }

                return isBlockDataInterface(value) ? value : block.blockDataFactory(value);
            },
            { toClassOnly: true },
        )
        @BlockField(Object.values(supportedBlocks))
        props: BlockDataInterface;

        async transformToPlain(deps: TransformDependencies, { includeInvisibleContent }: BlockContext): Promise<TraversableTransformResponse> {
            return {
                key: this.key,
                visible: this.visible,
                type: this.type,
                // admin must see the subblock, site must only see sublock when it is not hidden, all otherr cases do not get the subblock
                props: includeInvisibleContent || this.visible ? this.props : {},
            };
        }
    }

    class BlockBlocks extends BlockData {
        @Transform((items: BlockBlocksItem[]) =>
            items
                .filter((item) => {
                    if (!supportedBlocks[item.type]) {
                        console.warn(`Unknown block type "${item.type}"`);
                        return false;
                    }

                    return true;
                })
                .map((item) => plainToClass(BlockBlocksItem, item)),
        )
        @BlockField(BlockBlocksItem)
        blocks: BlockBlocksItem[];

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
                name: supportedBlocks[childBlock.type].name,
            }));
        }
    }

    class BlockBlocksInput extends BlockInput {
        @Transform((items: BlockBlocksItemInput[]) =>
            items
                .filter((item) => {
                    if (!supportedBlocks[item.type]) {
                        console.warn(`Unknown block type "${item.type}"`);
                        return false;
                    }

                    return true;
                })
                .map((item) => plainToClass(BlockBlocksItemInput, item)),
        )
        @ValidateNested({ each: true })
        blocks: BlocksBlockInputInterface<BlockMap>["blocks"];

        transformToBlockData(): BlockBlocks {
            return plainToClass(BlockBlocks, {
                blocks: this.blocks.map((block) => block.transformToBlockData()),
            });
        }
    }

    class BlockBlocksItemInput extends BlockInput {
        @Allow()
        @IsString()
        key: string;

        @IsBoolean()
        visible: boolean;

        @IsString()
        type: string;

        @Transform(
            (value, obj) => {
                const blockType = obj.type as string;
                const block = supportedBlocks[blockType];

                if (!block) {
                    throw new Error(`unknown type ${blockType}`);
                }

                return isBlockInputInterface(value) ? value : block.blockInputFactory(value);
            },
            { toClassOnly: true },
        )
        @ValidateNested()
        props: BlockInputInterface;

        transformToBlockData(): BlockBlocksItem {
            return plainToClass(BlockBlocksItem, {
                key: this.key,
                visible: this.visible,
                type: this.type,
                props: this.props.transformToBlockData(),
            });
        }
    }

    return createBlock(BlockBlocks, BlockBlocksInput, nameOrOptions);
}

// internal helper
type ExtractBlockMap<T> = T extends Block<BlockDataInterface, BlocksBlockInputInterface<infer BlockMap>> ? BlockMap : never;

// Useful for creating fixtures
export type BlocksBlockFixturesGeneratorMap<T extends Block> = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [Typename in keyof ExtractBlockMap<T>]: (...args: any[]) => ExtractBlockInputFactoryProps<ExtractBlockMap<T>[Typename]>;
};
