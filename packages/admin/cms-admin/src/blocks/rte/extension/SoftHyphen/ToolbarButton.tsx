import { SoftHyphen } from "@comet/admin-icons";
import { ControlButton } from "@comet/admin-rte";
import { IControlProps } from "@comet/admin-rte/lib/core/types"; //@TODO export from RTE
import Tooltip from "@mui/material/Tooltip";
import { EditorState, Modifier } from "draft-js";
import * as React from "react";
import { FormattedMessage } from "react-intl";

const SHY_UNICODE_CHAR = 0x00ad;

export function ToolbarButton({ editorState, setEditorState }: IControlProps): React.ReactElement {
    function handleClick(e: React.MouseEvent) {
        e.preventDefault(); // important to preserve focus
        const currentContent = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        //@TODO: insert \u00ad in a way that link-entities dont break when inserted in the middle of a link text
        // right now the link is split into 2 link-entities
        // works as expected when \u00ad is copied and pasted: https://unicode.flopp.net/c/00AD
        const textWithEntity = Modifier.insertText(currentContent, selection, String.fromCharCode(SHY_UNICODE_CHAR));
        setEditorState(EditorState.push(editorState, textWithEntity, "insert-characters"));
    }

    return (
        <Tooltip
            title={<FormattedMessage id="comet.rte.extensions.softHyphen.buttonTooltip" defaultMessage="Insert a soft hyphen" />}
            placement="top"
        >
            <span>
                <ControlButton icon={SoftHyphen} onButtonClick={handleClick} />{" "}
            </span>
        </Tooltip>
    );
}
