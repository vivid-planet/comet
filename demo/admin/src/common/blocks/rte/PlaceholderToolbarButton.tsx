import { CancelButton, Dialog, OkayButton } from "@comet/admin";
import { RteTextPlaceholder } from "@comet/admin-icons";
import { ControlButton, selectionIsInOneBlock } from "@comet/admin-rte";
import { DialogActions, DialogContent } from "@mui/material";
import { type ContentBlock, EditorState, Modifier, SelectionState } from "draft-js";
import { type ReactElement, useCallback, useState } from "react";
import { FormattedMessage } from "react-intl";

import { PlaceholderBlock, type PlaceholderBlockState } from "../PlaceholderBlock";
import { PLACEHOLDER_ENTITY_TYPE } from "./PlaceholderDecorator";

function getPlaceholderLabel(state: PlaceholderBlockState): string {
    if (state.field === "price") {
        return state.productPrice ?? "Price";
    }
    return state.productTitle ?? "Title";
}

function findPlaceholderAtCursor(editorState: EditorState) {
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();

    if (!selectionIsInOneBlock(editorState)) {
        return { entity: null, entitySelection: null };
    }

    const blockKey = selection.getStartKey();
    const block: ContentBlock = contentState.getBlockForKey(blockKey);
    const offset = selection.getStartOffset();

    // Check the character at cursor and the one before it
    const offsets = [offset - 1, offset].filter((o) => o >= 0 && o < block.getLength());

    for (const o of offsets) {
        const entityKey = block.getEntityAt(o);
        if (entityKey) {
            const entity = contentState.getEntity(entityKey);
            if (entity.getType() === PLACEHOLDER_ENTITY_TYPE) {
                // Find the full range of this entity
                let start = o;
                let end = o + 1;
                while (start > 0 && block.getEntityAt(start - 1) === entityKey) start--;
                while (end < block.getLength() && block.getEntityAt(end) === entityKey) end++;

                const entitySelection = new SelectionState({
                    anchorKey: blockKey,
                    anchorOffset: start,
                    focusKey: blockKey,
                    focusOffset: end,
                });
                return { entity, entitySelection };
            }
        }
    }

    return { entity: null, entitySelection: null };
}

interface PlaceholderToolbarButtonProps {
    editorState: EditorState;
    setEditorState: (editorState: EditorState) => void;
}

export function PlaceholderToolbarButton({ editorState, setEditorState }: PlaceholderToolbarButtonProps): ReactElement {
    const [open, setOpen] = useState(false);
    const { entity: placeholderEntity, entitySelection: placeholderSelection } = findPlaceholderAtCursor(editorState);
    const disabled = !selectionIsInOneBlock(editorState);

    function handleClick() {
        if (disabled) {
            return;
        }
        if (placeholderEntity && placeholderSelection) {
            setEditorState(EditorState.forceSelection(editorState, placeholderSelection));
        }
        setOpen(true);
    }

    return (
        <ControlButton disabled={disabled} onButtonClick={handleClick} icon={RteTextPlaceholder} selected={!!placeholderEntity}>
            {open && (
                <PlaceholderDialog
                    editorState={editorState}
                    setEditorState={setEditorState}
                    placeholderEntity={placeholderEntity}
                    onClose={() => setOpen(false)}
                />
            )}
        </ControlButton>
    );
}

interface PlaceholderDialogProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    placeholderEntity: any;
    editorState: EditorState;
    setEditorState: (editorState: EditorState) => void;
    onClose: () => void;
}

function PlaceholderDialog({ onClose, placeholderEntity, editorState, setEditorState }: PlaceholderDialogProps) {
    const initialState = placeholderEntity ? placeholderEntity.getData() : PlaceholderBlock.defaultValues();
    const [state, setState] = useState(initialState);

    const handleUpdate = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            const contentState = editorState.getCurrentContent();
            const selection = editorState.getSelection();

            const label = getPlaceholderLabel(state);
            const contentStateWithEntity = contentState.createEntity(PLACEHOLDER_ENTITY_TYPE, "IMMUTABLE", state);
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

            if (placeholderEntity) {
                // Editing existing: replace text and entity data
                const newContentState = Modifier.replaceText(contentStateWithEntity, selection, label, undefined, entityKey);
                setEditorState(EditorState.push(editorState, newContentState, "insert-characters"));
            } else {
                // Creating new: insert label text with entity at the cursor
                const newContentState = Modifier.insertText(contentStateWithEntity, selection, label, undefined, entityKey);
                setEditorState(EditorState.push(editorState, newContentState, "insert-characters"));
            }
            onClose();
        },
        [editorState, setEditorState, onClose, state, placeholderEntity],
    );

    return (
        <Dialog
            open={true}
            onClose={onClose}
            title={
                placeholderEntity ? (
                    <FormattedMessage id="placeholderBlock.editPlaceholder" defaultMessage="Edit Placeholder" />
                ) : (
                    <FormattedMessage id="placeholderBlock.insertPlaceholder" defaultMessage="Insert Placeholder" />
                )
            }
        >
            <DialogContent>
                <PlaceholderBlock.AdminComponent state={state} updateState={setState} />
            </DialogContent>
            <DialogActions>
                <CancelButton onClick={onClose} />
                <OkayButton onClick={handleUpdate} />
            </DialogActions>
        </Dialog>
    );
}
