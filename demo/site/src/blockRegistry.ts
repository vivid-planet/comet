import { GraphQLClient } from "graphql-request";

import blockMeta from "../block-meta.json";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface RegisterBlockOptions<BlockData> {
    loader: (options: { blockData: BlockData; client: GraphQLClient }) => Promise<any> | any;
}
const blocks: Record<string, RegisterBlockOptions<unknown>> = {};
export function registerBlock<BlockData>(blockName, options: RegisterBlockOptions<BlockData>) {
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
}: {
    blockType: string;
    blockData: any;
    client: GraphQLClient;
}): Promise<any> {
    const block = blockMeta.find((block) => block.name === blockType);
    if (!block) throw new Error("iunvalid blockType");

    async function iterate(block, passedBlockData) {
        const blockData = { ...passedBlockData };
        for (const field of block.fields) {
            if (!blockData[field.name]) {
                //null
                continue;
            } else if (field.kind == "NestedObjectList") {
                blockData[field.name] = await Promise.all(
                    blockData[field.name].map(async (i) => {
                        return iterate(field.object, i);
                    }),
                );
            } else if (field.kind == "NestedObject") {
                blockData[field.name] = await iterate(field.object, blockData[field.name]);
            } else if (field.kind == "OneOfBlocks") {
                const oneOfBlockType = field.blocks[blockData.type];
                if (!oneOfBlockType) throw new Error("invalid blockType");
                blockData[field.name] = await recursivelyLoadBlockData({ blockType: oneOfBlockType, blockData: blockData[field.name], client });
            } else if (field.kind == "Block") {
                blockData[field.name] = await recursivelyLoadBlockData({ blockType: field.block, blockData: blockData[field.name], client });
            }
        }
        return blockData;
    }
    let newBlockData = await iterate(block, blockData);
    newBlockData = await loadBlockData({ blockType, blockData: newBlockData, client });
    return newBlockData;
}
