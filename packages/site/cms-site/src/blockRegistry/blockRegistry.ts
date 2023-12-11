import type { GraphQLClient } from "graphql-request";

type BlockMetaField = {
    name: string;
    kind: string;
    nullable: boolean;
    enum?: string[];
    block?: string;
    blocks?: Record<string, string>;
    object?: { fields: BlockMetaField[] };
};

interface BlockMeta {
    name: string;
    fields: BlockMetaField[];
    inputFields: BlockMetaField[];
}

// we have two typings for block meta
// 1. for the public api (BlockMeta, BlockMetaField): simpler and compatible with import from block-meta.json (where eg. kind is a string)
// 2. for the internal api (BetterBlockMeta, BetterBlockMetaField): more complex with more type safety
type BetterBlockMetaField =
    | {
          name: string;
          kind: "String" | "Number" | "Boolean" | "Json";
          nullable: boolean;
      }
    | {
          name: string;
          kind: "Enum";
          nullable: boolean;
          enum: string[];
      }
    | {
          name: string;
          kind: "Block";
          nullable: boolean;
          block: string;
      }
    | {
          name: string;
          kind: "OneOfBlocks";
          nullable: boolean;
          blocks: Record<string, string>;
      }
    | {
          name: string;
          kind: "NestedObject" | "NestedObjectList";
          nullable: boolean;
          object: BetterBlockMetaNestedObject;
      };

interface BetterBlockMeta {
    name: string;
    fields: BetterBlockMetaField[];
    inputFields: BetterBlockMetaField[];
}

interface BetterBlockMetaNestedObject {
    fields: BetterBlockMetaField[];
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface RegisterBlockOptions<BlockData> {
    loader: (options: { blockData: BlockData; client: GraphQLClient }) => Promise<any> | any;
}
const blocks: Record<string, RegisterBlockOptions<any>> = {};
export function registerBlock<BlockData = unknown>(blockName: string, options: RegisterBlockOptions<BlockData>) {
    blocks[blockName] = options;
}

export async function loadBlockData({ blockType, blockData, client }: { blockType: string; blockData: any; client: GraphQLClient }) {
    const blockOptions = blocks[blockType];
    if (blockOptions) {
        return {
            ...blockData,
            loaded: await blockOptions.loader({ blockData, client }),
        };
    }
    return blockData;
}

// TODO avoid waterfall loading, instead collect promises and await them all at once
export async function recursivelyLoadBlockData({
    blockType,
    blockData,
    client,
    blocksMeta,
}: {
    blockType: string;
    blockData: unknown;
    client: GraphQLClient;
    blocksMeta: BlockMeta[];
}): Promise<any> {
    const block = blocksMeta.find((block) => block.name === blockType) as BetterBlockMeta;
    if (!block) throw new Error("invalid blockType");

    async function iterate(block: BetterBlockMeta | BetterBlockMetaNestedObject, passedBlockData: any) {
        const blockData = { ...passedBlockData };
        for (const field of block.fields) {
            if (!blockData[field.name]) {
                //null
                continue;
            } else if (field.kind == "NestedObjectList") {
                blockData[field.name] = await Promise.all(
                    blockData[field.name].map(async (i: any) => {
                        return iterate(field.object, i);
                    }),
                );
            } else if (field.kind == "NestedObject") {
                blockData[field.name] = await iterate(field.object, blockData[field.name]);
            } else if (field.kind == "OneOfBlocks") {
                const oneOfBlockType = field.blocks[blockData.type];
                if (!oneOfBlockType) throw new Error("invalid blockType");
                blockData[field.name] = await recursivelyLoadBlockData({
                    blockType: oneOfBlockType,
                    blockData: blockData[field.name],
                    client,
                    blocksMeta,
                });
            } else if (field.kind == "Block") {
                blockData[field.name] = await recursivelyLoadBlockData({
                    blockType: field.block,
                    blockData: blockData[field.name],
                    client,
                    blocksMeta,
                });
            }
        }
        return blockData;
    }
    let newBlockData = await iterate(block, blockData);
    newBlockData = await loadBlockData({ blockType, blockData: newBlockData, client });
    return newBlockData;
}
