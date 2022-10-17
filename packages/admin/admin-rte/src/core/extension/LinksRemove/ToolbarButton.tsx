import LinkOffIcon from "@mui/icons-material/LinkOff";
import { RichUtils } from "draft-js";
import * as React from "react";

import ControlButton from "../../Controls/ControlButton";
import { IControlProps } from "../../types";
export default function ToolbarButton(props: IControlProps) {
    const selection = props.editorState.getSelection();
    const globallyDisabled = !!props.disabled;

    const buttonEnabled = !selection.isCollapsed(); // @TODO: better to scan the selection if any link-entities are in the selection
    function handleClick(e: React.MouseEvent) {
        e.preventDefault();
        if (buttonEnabled) {
            props.setEditorState(RichUtils.toggleLink(props.editorState, selection, null)); // @TODO, this removes all entities not only LINK entity, should be improved, now its ok as there are no other entities than links
        }
    }

    return <ControlButton icon={LinkOffIcon} disabled={globallyDisabled || !buttonEnabled} onButtonClick={handleClick} />;
}
