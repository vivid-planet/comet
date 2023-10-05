import { NonBreakingSpace } from "@comet/admin-icons";
import Tooltip from "@mui/material/Tooltip";
import { EditorState, Modifier } from "draft-js";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import ControlButton from "../../Controls/ControlButton";
import { IControlProps } from "../../types";

const NO_BREAK_SPACE_UNICODE_CHAR = 0x00a0;

function ToolbarButton({ editorState, setEditorState }: IControlProps): React.ReactElement {
    function handleClick(event: React.MouseEvent) {
        event.preventDefault(); // Preserve focus in editor

        const currentContent = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        // TODO insert \u00a0 in a way that link-entities dont break when inserted in the middle of a link text
        // right now the link is split into 2 link-entities
        // works as expected when \u00ad is copied and pasted: https://unicode.flopp.net/c/00A0
        const textWithEntity = Modifier.insertText(currentContent, selection, String.fromCharCode(NO_BREAK_SPACE_UNICODE_CHAR));
        setEditorState(EditorState.push(editorState, textWithEntity, "insert-characters"));
    }

    return (
        <Tooltip
            title={<FormattedMessage id="comet.rte.extensions.nonBreakingSpace.buttonTooltip" defaultMessage="Insert a non-breaking space" />}
            placement="top"
        >
            <span>
                <ControlButton icon={NonBreakingSpace} onButtonClick={handleClick} />
            </span>
        </Tooltip>
    );
}

export default ToolbarButton;
