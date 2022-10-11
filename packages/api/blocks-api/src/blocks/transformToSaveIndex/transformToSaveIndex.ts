import { FlatBlocks } from "../../flat-blocks/flat-blocks";
import { Block, BlockDataInterface, BlockIndex } from "../block";

export function transformToSaveIndex(block: Block, blockData: BlockDataInterface): BlockIndex {
    const flatBlocks = new FlatBlocks(blockData, { name: block.name, visible: true, rootPath: "root" }); // breadthFirst or depthFirst is equally ok for the app, but the tests for original version are written for depth first traversal

    return flatBlocks.depthFirst().map((c) => {
        return {
            blockname: c.name,
            jsonPath: c.pathToString(),
            visible: c.visible,
            target: c.block.indexData(),
        };
    });
}
