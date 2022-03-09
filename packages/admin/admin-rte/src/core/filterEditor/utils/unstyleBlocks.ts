/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { EditorState } from "draft-js";

import { FilterEditorStateFn } from "../../types";

type BlockBlacklist = string[];

// inspired by https://github.com/thibaudcolas/draftjs-filters/blob/master/src/lib/filters/blocks.js#L127
const unstyleBlocks: (blockBlacklist: BlockBlacklist) => FilterEditorStateFn = (blockBlacklist) => (nextState) => {
    const content = nextState.getCurrentContent();
    const blockMap = content.getBlockMap();

    const changedBlocks = blockMap
        .filter((block) => !block || blockBlacklist.includes(block.getType()))
        .map((block) => {
            return block!.merge({
                type: "unstyled",
                depth: 0,
            });
        });

    return EditorState.set(nextState, {
        currentContent: content.merge({
            blockMap: blockMap.merge(changedBlocks as typeof blockMap),
        }),
    });
};

export default unstyleBlocks;
