import { DraftBlockType, Editor as DraftJsEditor, EditorProps as DraftJsEditorProps } from "draft-js";
import { FilterEditorStateBeforeUpdateFn, SuportedThings } from "../Rte";
import { FilterEditorStateFn, InlineStyleType } from "../types";
import unstyleBlocks from "./utils/unstyleBlocks";

const removeUnsupportedBlocks: FilterEditorStateBeforeUpdateFn = (newState, { supports }) => {
    // unstyle all core-blocks which are not supported
    const blackListBlocks: DraftBlockType[] = ["paragraph", "header-four", "header-five", "header-six", "blockquote", "code-block", "atomic"]; // these are not supported at all by our rte

    const supportsToBlockMap: Partial<Record<SuportedThings, DraftBlockType>> = {
        "header-one": "header-one",
        "header-two": "header-two",
        "header-three": "header-three",
        "ordered-list": "ordered-list-item",
        "unordered-list": "unordered-list-item",
    };
    const supportsToTest = Object.keys(supportsToBlockMap) as SuportedThings[];
    supportsToTest.forEach(support => {
        if (!supports.includes(support) && supportsToBlockMap[support]) {
            const blockType = supportsToBlockMap[support];
            if (blockType) {
                blackListBlocks.push(blockType);
            }
        }
    });

    return unstyleBlocks(blackListBlocks)(newState);
};

export default removeUnsupportedBlocks;
