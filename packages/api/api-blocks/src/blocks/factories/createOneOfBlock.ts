import { plainToClass, Transform } from "class-transformer";
import { ArrayMinSize, IsIn, IsOptional, IsString, ValidateNested } from "class-validator";

import {
    Block,
    BlockContext,
    BlockData,
    BlockDataInterface,
    BlockInput,
    BlockInputInterface,
    BlockMetaField,
    BlockMetaFieldKind,
    ChildBlockInfo,
    createBlock,
    ExtractBlockData,
    ExtractBlockInput,
    isBlockDataInterface,
    isBlockInputInterface,
    MigrateOptions,
    SimpleBlockInputInterface,
    TraversableTransformResponse,
} from "../block";
import { AnnotationBlockMeta, BlockField } from "../decorators/field";
import { TransformDependencies } from "../dependencies";

type BaseBlockMap = Record<string, Block<BlockDataInterface, BlockInputInterface>>;

interface Options<BlockMap extends BaseBlockMap> {
    supportedBlocks: BlockMap;
    allowEmpty?: boolean;
}

interface OneOfBlockDataInterface<BlockMap extends BaseBlockMap> extends BlockDataInterface {
    attachedBlocks: SupportedBlocksDataInterfaces<BlockMap>[];
    activeType?: keyof BlockMap;
}

type SupportedBlocksDataInterfaces<BlockMap extends BaseBlockMap> = {
    [Typename in keyof BlockMap]: BlockDataInterface & {
        type: Typename;
        props: ExtractBlockData<BlockMap[Typename]>;
    };
}[keyof BlockMap];

interface OneOfBlockInputInterface<BlockMap extends BaseBlockMap> extends SimpleBlockInputInterface {
    attachedBlocks: SupportedBlocksInputInterfaces<BlockMap>[];
    activeType?: keyof BlockMap;
}

type SupportedBlocksInputInterfaces<BlockMap extends BaseBlockMap> = {
    [Typename in keyof BlockMap]: SimpleBlockInputInterface & {
        type: Typename;
        props: ExtractBlockInput<BlockMap[Typename]>;
    };
}[keyof BlockMap];

export function createOneOfBlock<BlockMap extends BaseBlockMap>(
    { supportedBlocks, allowEmpty = true }: Options<BlockMap>,
    nameOrOptions: string | { name: string; migrate?: MigrateOptions },
): Block<OneOfBlockDataInterface<BlockMap>, OneOfBlockInputInterface<BlockMap>> {
    const supportedBlockTypes: Array<keyof BlockMap | null> = Object.keys(supportedBlocks);

    if (allowEmpty) {
        supportedBlockTypes.push(null);
    }

    class BlockOneOfItem extends BlockData {
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
        props: BlockData;

        async transformToPlain(): Promise<TraversableTransformResponse> {
            return {
                type: this.type,
                props: this.props,
            };
        }
    }

    class BlockOneOf extends BlockData {
        @Transform((items: BlockOneOfItem[]) =>
            items
                .filter((item) => {
                    if (!supportedBlocks[item.type]) {
                        console.warn(`Unknown block type "${item.type}"`);
                        return false;
                    }

                    return true;
                })
                .map((item) => plainToClass(BlockOneOfItem, item)),
        )
        attachedBlocks: OneOfBlockDataInterface<BlockMap>["attachedBlocks"][number][];

        // index of blocks
        activeType?: string;

        async transformToPlain(deps: TransformDependencies, { includeInvisibleContent }: BlockContext): Promise<TraversableTransformResponse> {
            const block = this.attachedBlocks.find((c) => c.type === this.activeType);
            return {
                attachedBlocks: includeInvisibleContent ? this.attachedBlocks : [], // only admin must see inactive blocks
                block: block ?? null,
                activeType: this.activeType && supportedBlocks[this.activeType] ? this.activeType : null,
            };
        }

        childBlocksInfo(): ChildBlockInfo[] {
            return this.attachedBlocks.map((childBlock, index) => {
                const blockConfig = supportedBlocks[childBlock.type];

                return {
                    visible: this.activeType === childBlock.type,
                    relJsonPath: ["attachedBlocks", index, "props"],
                    block: childBlock.props,
                    name: blockConfig.name,
                };
            });
        }
    }

    class BlockOneOfInput extends BlockInput {
        @Transform((items: BlockOneOfItemInput[]) =>
            items
                .filter((item) => {
                    if (!supportedBlocks[item.type]) {
                        console.warn(`Unknown block type "${item.type}"`);
                        return false;
                    }

                    return true;
                })
                .map((item) => plainToClass(BlockOneOfItemInput, item)),
        )
        @ArrayMinSize(allowEmpty ? 0 : 1)
        @ValidateNested({ each: true })
        attachedBlocks: OneOfBlockInputInterface<BlockMap>["attachedBlocks"];

        @IsOptional()
        @IsIn(supportedBlockTypes)
        @BlockField({ nullable: allowEmpty })
        activeType?: string;

        transformToBlockData(): BlockOneOf {
            const attachedBlocks = this.attachedBlocks.map((block) => block.transformToBlockData());

            return plainToClass(BlockOneOf, {
                attachedBlocks,
                activeType: this.activeType && supportedBlocks[this.activeType] ? this.activeType : null,
            });
        }
    }

    class BlockOneOfItemInput extends BlockInput {
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

        transformToBlockData(): BlockOneOfItem {
            const blockType = this.type;
            const block = supportedBlocks[blockType];

            if (!block) {
                throw new Error(`unknown type ${blockType}`);
            }

            return plainToClass(BlockOneOfItem, {
                type: this.type,
                props: this.props.transformToBlockData(),
            });
        }
    }

    class Meta extends AnnotationBlockMeta {
        get fields(): BlockMetaField[] {
            const attachedBlocksField: BlockMetaField = {
                name: "attachedBlocks",
                kind: BlockMetaFieldKind.NestedObjectList,
                object: {
                    fields: [
                        { name: "type", kind: BlockMetaFieldKind.String, nullable: false },
                        {
                            name: "props",
                            kind: BlockMetaFieldKind.OneOfBlocks,
                            blocks: Object.values(supportedBlocks),
                            nullable: false,
                        },
                    ],
                },
                nullable: false,
            };

            return [
                attachedBlocksField,
                {
                    name: "activeType",
                    kind: BlockMetaFieldKind.String,
                    nullable: true,
                },
                {
                    name: "block",
                    kind: BlockMetaFieldKind.NestedObject,
                    nullable: true,
                    object: attachedBlocksField.object,
                },
            ];
        }
    }

    let name: string;
    let migrate: MigrateOptions | undefined;

    if (typeof nameOrOptions === "string") {
        name = nameOrOptions;
    } else {
        name = nameOrOptions.name;
        migrate = nameOrOptions.migrate;
    }

    return createBlock(BlockOneOf, BlockOneOfInput, { name, blockMeta: new Meta(BlockOneOf), migrate });
}
