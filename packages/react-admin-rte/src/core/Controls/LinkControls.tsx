import ButtonGroup from "@material-ui/core/ButtonGroup";
import * as React from "react";
import { ToolbarButton as LinkToolbarButton } from "../extension/Link";
import { IControlProps } from "../types";

export default function ListsControls({ editorState, setEditorState, options: { supports: supportedThings } }: IControlProps) {
    if (!supportedThings.includes("link") && !supportedThings.includes("link-remove")) {
        return null;
    }

    return <ButtonGroup>{supportedThings.includes("link") && <LinkToolbarButton editorState={editorState} onChange={setEditorState} />}</ButtonGroup>;
}
