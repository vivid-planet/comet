/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassConstructor, instanceToPlain, plainToInstance } from "class-transformer";

import { createAppliedMigrationsBlockDataFactoryDecorator } from "../migrations/createAppliedMigrationsBlockDataFactoryDecorator";
import { BlockDataMigrationVersion } from "../migrations/decorators/BlockDataMigrationVersion";
import { BlockMigrationInterface } from "../migrations/types";
import { SearchText } from "../search/get-search-text";
import { AnnotationBlockMeta, getBlockFieldData, getFieldKeys } from "./decorators/field";
import { TransformDependencies } from "./dependencies";
import { strictBlockDataFactoryDecorator } from "./helpers/strictBlockDataFactoryDecorator";
import { strictBlockInputFactoryDecorator } from "./helpers/strictBlockInputFactoryDecorator";

export interface TraversableTransformResponse {
    [member: string]:
        | string
        | number
        | boolean
        | null
        | undefined
        | BlockDataInterface
        | TraversableTransformResponseArray
        | TraversableTransformResponse;
}
export type TraversableTransformResponseArray = Array<
    string | number | boolean | null | undefined | BlockDataInterface | TraversableTransformResponseArray | TraversableTransformResponse
>;

export interface TransformResponse {
    [member: string]: string | number | boolean | null | undefined | TransformResponseArray | TransformResponse;
}
export type TransformResponseArray = Array<string | number | boolean | null | undefined | TransformResponseArray | TransformResponse>;
export interface ChildBlockInfo {
    visible: boolean;
    relJsonPath: Array<string | number>;
    block: BlockDataInterface;
    name: string;
}
export interface BlockIndexData {
    dependencies?: Array<{
        targetEntityName: string;
        id: string;
    }>;
}
export declare type BlockIndexItem = {
    [key: string]: any; // For compatibility with TraversableTransformResponse
    blockname: string;
    jsonPath: string;
    visible: boolean;
} & BlockIndexData;
export declare type BlockIndex = Array<BlockIndexItem>;

export interface BlockDataInterface {
    transformToPlain(deps: TransformDependencies, ctx: BlockContext): Promise<TraversableTransformResponse>;
    transformToSave(): TraversableTransformResponse;
    indexData(): BlockIndexData;
    searchText(): SearchText[];
    childBlocksInfo(): ChildBlockInfo[]; // @TODO: better name for method and Type, maybe ReflectChildBlocks ?
    previewImageUrlTemplate(dependencies: Record<string, any>, context: BlockContext): Promise<string | undefined>;
}

export abstract class BlockData implements BlockDataInterface {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async transformToPlain(deps: TransformDependencies, ctx: BlockContext): Promise<TraversableTransformResponse> {
        return { ...(this as any) };
    }

    transformToSave(): TraversableTransformResponse {
        return this as any; // MUST NOT transform it's child blocks (these handle transforming themselves)
    }

    indexData(): BlockIndexData {
        return {};
    }
    childBlocksInfo(): ChildBlockInfo[] {
        const ret: ChildBlockInfo[] = [];
        for (const key of getFieldKeys({ prototype: Object.getPrototypeOf(this) })) {
            const data = getBlockFieldData({ prototype: Object.getPrototypeOf(this) }, key);
            if (data.kind == BlockMetaFieldKind.Block && (this as any)[key]) {
                ret.push({
                    visible: true,
                    relJsonPath: [key],
                    block: (this as any)[key],
                    name: data.block.name,
                });
            }
        }
        return ret;
    }
    searchText(): SearchText[] {
        return [];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async previewImageUrlTemplate(dependencies: Record<string, any>, context: BlockContext): Promise<string | undefined> {
        return undefined;
    }
}

export function isBlockDataInterface(test: unknown | BlockDataInterface): test is BlockDataInterface {
    if (test !== null && typeof test === "object") {
        if (
            typeof (test as BlockDataInterface).transformToPlain === "function" &&
            typeof (test as BlockDataInterface).transformToSave === "function"
        ) {
            return true;
        }
    }
    return false;
}
export type ExtractBlockData<B extends Block> = B extends Block<infer BlockData> ? BlockData : never;
export type ExtractBlockInput<B extends Block> = B extends Block<any, infer BlockInput> ? BlockInput : never;
// export type ExtractBlockInputFactoryProps<B extends Block> = B extends Block<any, BlockInputInterface<any, infer FactoryProps>>
//     ? FactoryProps
//     : never;

export type ExtractBlockInputFactoryProps<B extends Block> = B extends Block<any, infer Input> ? ReturnType<Input["toPlain"]> : never;

type BaseFactoryProps = undefined | Record<string, any>;
type WithoutBlockInputMethods<T extends Record<string, any>> = Omit<T, "transformToBlockData" | "toPlain">;

// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types
type Unpacked<T> = T extends (infer U)[] ? U : T extends (...args: any[]) => infer U ? U : T extends Promise<infer U> ? U : T;

export type NestedToPlainReturn<T extends Record<string, any>> = WithoutBlockInputMethods<{
    [Key in keyof T]: T[Key] extends BlockInputInterface | undefined // value is a BlockInputInterface
        ? ReturnType<NonNullable<T[Key]>["toPlain"]>
        : T[Key] extends BlockInputInterface[] | undefined // value is an array of BlockInputInterfaces
        ? ReturnType<NonNullable<Unpacked<T[Key]>>["toPlain"]>[]
        : T[Key];
}>;

export type CreateToPlainReturn<Input extends BlockInputInterface, FactoryProps extends BaseFactoryProps = undefined> = [FactoryProps] extends [
    undefined,
]
    ? NestedToPlainReturn<Input>
    : FactoryProps;

export interface BlockInputInterface<
    BlockType extends BlockDataInterface = BlockDataInterface,
    FactoryProps extends BaseFactoryProps = BaseFactoryProps,
> {
    transformToBlockData(): BlockType;
    toPlain(): CreateToPlainReturn<this, FactoryProps>;
}

export type SimpleBlockInputInterface<BlockType extends BlockDataInterface = BlockDataInterface> = BlockInputInterface<BlockType, undefined>;
export abstract class BlockInput<BlockType extends BlockDataInterface = BlockDataInterface> implements BlockInputInterface<BlockType, undefined> {
    abstract transformToBlockData(): BlockType;

    toPlain(): CreateToPlainReturn<this> {
        const dataWithChildBlocksTransformed = Object.fromEntries(
            Object.entries(this).map(([k, v]) => {
                if (isBlockInputInterface(v)) {
                    v = v.toPlain();
                }
                if (Array.isArray(v)) {
                    v = v.map((c) => (isBlockInputInterface(c) ? c.toPlain() : c));
                }
                return [k, v];
            }),
        );

        return instanceToPlain(dataWithChildBlocksTransformed) as CreateToPlainReturn<this>;
    }
}

export function isBlockInputInterface(test: unknown | BlockInputInterface): test is BlockInputInterface {
    if (test !== null && typeof test === "object") {
        if (typeof (test as BlockInputInterface).transformToBlockData === "function") {
            return true;
        }
    }
    return false;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BlockDataFactory<T extends BlockDataInterface = BlockDataInterface> = (obj: any) => T;

export type BlockInputFactory<T extends BlockInputInterface = BlockInputInterface> = (obj: ReturnType<T["toPlain"]>) => T;

export enum BlockMetaFieldKind {
    String = "String",
    Number = "Number",
    Boolean = "Boolean",
    Json = "Json",
    Enum = "Enum",
    Block = "Block",
    OneOfBlocks = "OneOfBlocks",
    NestedObject = "NestedObject",
    NestedObjectList = "NestedObjectList",
}

export type BlockMetaLiteralFieldKind = BlockMetaFieldKind.String | BlockMetaFieldKind.Number | BlockMetaFieldKind.Boolean | BlockMetaFieldKind.Json;

export type BlockMetaField =
    | {
          name: string;
          kind: BlockMetaLiteralFieldKind;
          nullable: boolean;
      }
    | { name: string; kind: BlockMetaFieldKind.Enum; enum: string[]; nullable: boolean }
    | { name: string; kind: BlockMetaFieldKind.Block; block: Block; nullable: boolean }
    | { name: string; kind: BlockMetaFieldKind.NestedObject; object: BlockMetaInterface; nullable: boolean }
    | { name: string; kind: BlockMetaFieldKind.NestedObjectList; object: BlockMetaInterface; nullable: boolean }
    | { name: string; kind: BlockMetaFieldKind.OneOfBlocks; blocks: Record<string, Block>; nullable: boolean };

export interface BlockMetaInterface {
    fields: BlockMetaField[];
}

export type Block<BlockType extends BlockDataInterface = BlockDataInterface, BlockInputType extends BlockInputInterface = BlockInputInterface> = {
    name: string;
    blockDataFactory: BlockDataFactory<BlockType>;
    blockInputFactory: BlockInputFactory<BlockInputType>;
    blockMeta: BlockMetaInterface;
    blockInputMeta: BlockMetaInterface;
};

const blocks: Block[] = [];

export interface MigrateOptions {
    migrations: ClassConstructor<BlockMigrationInterface>[];
    version: number;
}
interface CreateBlockOptions {
    name: string;
    blockMeta?: BlockMetaInterface;
    blockInputMeta?: BlockMetaInterface;
    migrate?: MigrateOptions;
}

export function createBlock<BlockType extends BlockDataInterface, BlockInputType extends BlockInputInterface>(
    BlockData: ClassConstructor<BlockType>,
    BlockInput: ClassConstructor<BlockInputType>,
    nameOrOptions: string | CreateBlockOptions,
    {
        // 4th argument is an options-hash
        overwrite,
    }: {
        overwrite: (block: Block<BlockType, BlockInputType>) => Block<BlockType, BlockInputType>;
    } = {
        overwrite: (block) => block,
    },
): Block<BlockType, BlockInputType> {
    const options: CreateBlockOptions =
        typeof nameOrOptions !== "string"
            ? nameOrOptions
            : { blockMeta: undefined, blockInputMeta: undefined, name: nameOrOptions, migrate: undefined };

    if (options.migrate && options.migrate.version > 0) {
        // Overwrite the transformToSave of BlockDate to append the version number
        BlockDataMigrationVersion(options.migrate.version)(BlockData);
    }

    const blockDataFactory: BlockDataFactory<BlockType> = (o) => {
        return plainToInstance(BlockData, o);
    };

    const blockInputFactory: BlockInputFactory<BlockInputType> = (o) => plainToInstance(BlockInput, o);

    // Decorate BlockDataFactory
    let decorateBlockDataFactory = blockDataFactory;
    if (options.migrate) {
        const blockDataFactoryDecorator1 = createAppliedMigrationsBlockDataFactoryDecorator(options.migrate.migrations, options.name);
        decorateBlockDataFactory = blockDataFactoryDecorator1(decorateBlockDataFactory);
    }
    decorateBlockDataFactory = strictBlockDataFactoryDecorator(decorateBlockDataFactory);

    // Decorate BlockInputFactory
    const decorateBlockInputFactory = strictBlockInputFactoryDecorator(blockInputFactory);

    const block: Block<BlockType, BlockInputType> = {
        name: typeof nameOrOptions === "string" ? nameOrOptions : nameOrOptions.name,
        blockDataFactory: decorateBlockDataFactory,
        blockInputFactory: decorateBlockInputFactory,
        blockMeta: options.blockMeta ? options.blockMeta : new AnnotationBlockMeta(BlockData),
        blockInputMeta: options.blockInputMeta ? options.blockInputMeta : new AnnotationBlockMeta(BlockInput),
    };

    const finalBlock = overwrite(block);
    registerBlock(finalBlock);

    return finalBlock;
}

export function registerBlock(block: Block): void {
    blocks.push(block);
}

export function getRegisteredBlocks(): Block[] {
    return blocks;
}

export interface BlockContext {
    includeInvisibleContent?: boolean;
    previewDamUrls?: boolean;
    relativeDamUrls?: boolean;
}

export function transformToSave(block: BlockDataInterface): TraversableTransformResponse {
    type Output = TransformResponse | TransformResponseArray | string | number | boolean | null | undefined;
    type Input = TraversableTransformResponse | TraversableTransformResponseArray | string | number | boolean | null | undefined | BlockDataInterface;
    function traverse(jsonObj: Input): Output {
        if (Array.isArray(jsonObj)) {
            return jsonObj.map((c) => traverse(c));
        } else if (jsonObj !== null && typeof jsonObj === "object") {
            const entries = Object.entries(isBlockDataInterface(jsonObj) ? jsonObj.transformToSave() : jsonObj);
            const mappedEntries = entries
                .map(([k, i]) => {
                    return [k, traverse(i)];
                })
                .filter(([, value]) => value !== undefined);
            return Object.fromEntries(mappedEntries);
        } else {
            // keep literal as it is
            return jsonObj;
        }
    }

    return traverse(block) as TraversableTransformResponse;
}

export function inputToData<T extends BlockDataInterface, V extends BlockInputInterface>(cls: ClassConstructor<T>, plain: V): T {
    const dataWithChildBlocksTransformed = Object.fromEntries(
        Object.entries(plain).map(([k, v]) => {
            if (isBlockInputInterface(v)) {
                v = v.transformToBlockData();
            }
            return [k, v];
        }),
    );
    return plainToInstance(cls, dataWithChildBlocksTransformed);
}
