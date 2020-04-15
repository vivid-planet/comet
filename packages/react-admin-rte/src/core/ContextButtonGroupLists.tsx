import { ButtonGroup } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import FormatIndentDecreaseIcon from "@material-ui/icons/FormatIndentDecrease";
import FormatIndentIncreaseIcon from "@material-ui/icons/FormatIndentIncrease";
import { BlockMap, ContentState, EditorState } from "draft-js";
import * as React from "react";

import getCurrentBlock from "./utils/getCurrentBlock";
import selectionIsInOneBlock from "./utils/selectionIsInOneBlock";

interface IProps {
    editorState: EditorState;
    onChange: (editorState: EditorState) => void;
    listLevelMax?: number;
}

// https://github.com/facebook/draft-js/blob/v0.11.4/src/model/transaction/adjustBlockDepthForContentState.js
// https://github.com/facebook/draft-js/blob/v0.11.4/src/model/modifier/RichTextEditorUtil.js

// to keep a nested structure, check version 0.10.5, in current version 0.11.4 nesting is not forced
// https://github.com/facebook/draft-js/blob/v0.10.5/src/model/modifier/RichTextEditorUtil.js
function adjustBlockDepth(type: "increase" | "decrease", editorState: EditorState, maxDepth: number): EditorState {
    const selectionState = editorState.getSelection();
    const contentState = editorState.getCurrentContent();

    // check that only one block is selected, otherwise we cananot change depth
    const key = selectionState.getAnchorKey();
    if (key !== selectionState.getFocusKey()) {
        return editorState;
    }

    const adjustment = type === "increase" ? 1 : -1;

    // do not exceed max depth
    const block = getCurrentBlock(editorState);
    if (!block) {
        return editorState;
    }
    const depth = block.getDepth();
    if (adjustment === 1 && depth === maxDepth) {
        return editorState;
    }

    const startKey = selectionState.getStartKey();
    const endKey = selectionState.getEndKey();
    let blockMap = contentState.getBlockMap();
    const blocks = blockMap
        .toSeq()
        .skipUntil((_, k) => k === startKey)
        .takeUntil((_, k) => k === endKey)
        .concat([[endKey, blockMap.get(endKey)]])
        .map(curBlock => {
            let blockDepth = curBlock!.getDepth() + adjustment;
            blockDepth = Math.max(0, Math.min(blockDepth, maxDepth));
            return curBlock!.set("depth", blockDepth);
        }) as BlockMap;

    blockMap = blockMap.merge(blocks);

    const newContent = contentState.merge({
        blockMap,
        selectionBefore: selectionState,
        selectionAfter: selectionState,
    }) as ContentState;

    return EditorState.push(editorState, newContent, "adjust-depth");
}

export default function ContextButtonGroupLists({ editorState, onChange, listLevelMax = 4 }: IProps) {
    const buttonGroupActive = React.useMemo(() => {
        const currentBlock = getCurrentBlock(editorState);
        if (!currentBlock) {
            return false;
        }
        return ["ordered-list-item", "unordered-list-item"].includes(currentBlock.getType()) && selectionIsInOneBlock(editorState);
    }, [editorState]);

    const canIndentLeft = buttonGroupActive && getCurrentBlock(editorState)!.getDepth() > 0;
    const canIndentRight = buttonGroupActive && getCurrentBlock(editorState)!.getDepth() < listLevelMax - 1;

    const handleListIndentLeftClick = React.useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            onChange(adjustBlockDepth("decrease", editorState, listLevelMax));
        },
        [editorState, onChange, listLevelMax],
    );
    const handleListIndentRightClick = React.useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            onChange(adjustBlockDepth("increase", editorState, listLevelMax));
        },
        [editorState, onChange, listLevelMax],
    );

    if (!buttonGroupActive) {
        return null;
    }

    return (
        <ButtonGroup>
            <IconButton color="default" onMouseDown={handleListIndentLeftClick} disabled={!canIndentLeft}>
                <FormatIndentDecreaseIcon />
            </IconButton>
            <IconButton color="default" onMouseDown={handleListIndentRightClick} disabled={!canIndentRight}>
                <FormatIndentIncreaseIcon />
            </IconButton>
        </ButtonGroup>
    );
}
