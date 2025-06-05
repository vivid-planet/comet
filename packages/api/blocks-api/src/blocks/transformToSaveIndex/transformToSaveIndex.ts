import { RawDraftContentState } from "draft-js";

import { FlatBlocks } from "../../flat-blocks/flat-blocks";
import { Block, BlockDataInterface, BlockIndex, BlockIndexItem, isBlockDataInterface } from "../block";

export function transformToSaveIndex(
    rootBlockInfo: Pick<Block, "name"> & { visible?: boolean; rootPath?: string },
    blockData: BlockDataInterface,
): BlockIndex {
    const flatBlocks = new FlatBlocks(blockData, {
        name: rootBlockInfo.name,
        visible: rootBlockInfo.visible ?? true,
        rootPath: rootBlockInfo.rootPath ?? "root",
    }); // breadthFirst or depthFirst is equally ok for the app, but the tests for original version are written for depth first traversal

    return flatBlocks.depthFirst().flatMap((c) => {
        const blockIndex: BlockIndex = [];

        let blockIndexItem: BlockIndexItem = {
            blockname: c.name,
            jsonPath: c.pathToString(),
            visible: c.visible,
        };

        // special handling for rich text blocks:
        // rich text blocks can contain link blocks in their draftContent entityMap
        // we need to extract the indexData from these link blocks and add them to the blockIndex
        if (isRichTextBlock(c.block)) {
            const entities = Object.values(c.block.draftContent.entityMap);

            for (const entity of entities) {
                if (isBlockDataInterface(entity.data)) {
                    const entityBlockIndex = transformToSaveIndex({ name: c.name, visible: c.visible, rootPath: c.pathToString() }, entity.data);
                    blockIndex.push(...entityBlockIndex);
                }
            }
        }

        const indexData = c.block.indexData();
        if (Object.keys(indexData).length > 0) {
            blockIndexItem = { ...blockIndexItem, ...indexData };
        }

        blockIndex.push(blockIndexItem);
        return blockIndex;
    });
}

function isRichTextBlock(block: BlockDataInterface): block is BlockDataInterface & { draftContent: RawDraftContentState } {
    return "draftContent" in block && typeof block.draftContent === "object";
}
