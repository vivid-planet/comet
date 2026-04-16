import { RteTextPlaceholder } from "@comet/admin-icons";
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { EditorState, Modifier } from "draft-js";
import { type MouseEvent, useState } from "react";

import { ControlButton } from "../../Controls/ControlButton";
import { type IControlProps } from "../../types";
import { ENTITY_TYPE } from "./Decorator";

export default function ToolbarButton({ editorState, setEditorState, options }: IControlProps) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const placeholders = options.placeholders ?? [];

    function handleButtonClick(e: MouseEvent) {
        e.preventDefault();
        setAnchorEl(e.currentTarget as HTMLElement);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    function handleInsertPlaceholder(placeholder: { key: string; label: React.ReactNode }) {
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();

        const placeholderText = `{{${placeholder.key}}}`;

        const contentStateWithEntity = contentState.createEntity(ENTITY_TYPE, "IMMUTABLE", { key: placeholder.key });
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

        const contentStateWithPlaceholder = Modifier.replaceText(contentStateWithEntity, selection, placeholderText, undefined, entityKey);

        const newEditorState = EditorState.push(editorState, contentStateWithPlaceholder, "insert-characters");
        setEditorState(newEditorState);
        handleClose();
    }

    if (placeholders.length === 0) {
        return null;
    }

    return (
        <>
            <ControlButton icon={RteTextPlaceholder} onButtonClick={handleButtonClick} />
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                {placeholders.map((placeholder) => (
                    <MenuItem
                        key={placeholder.key}
                        onClick={() => {
                            handleInsertPlaceholder(placeholder);
                        }}
                    >
                        <ListItemIcon>
                            <RteTextPlaceholder fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>{placeholder.label}</ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}
