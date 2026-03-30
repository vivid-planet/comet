import { CancelButton, Dialog, OkayButton } from "@comet/admin";
import { RteTextPlaceholder } from "@comet/admin-icons";
import { ControlButton, type IControlProps, selectionIsInOneBlock } from "@comet/admin-rte";
import { DialogActions, DialogContent } from "@mui/material";
import { type ContentBlock, EditorState, type EntityInstance, Modifier, SelectionState } from "draft-js";
import { type ReactElement, useCallback, useState } from "react";
import { FormattedMessage } from "react-intl";

import { formatPrice } from "../placeholder/formatPrice";
import { PlaceholderBlock, type PlaceholderBlockState } from "../PlaceholderBlock";
import { PLACEHOLDER_ENTITY_TYPE } from "./PlaceholderDecorator";

function getPlaceholderLabel(state: PlaceholderBlockState): string {
    if (state.field === "price") {
        return formatPrice(state.productPrice) ?? "Price";
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

export function PlaceholderToolbarButton({ editorState, setEditorState, disabled: globallyDisabled }: IControlProps): ReactElement {
    const [open, setOpen] = useState(false);
    const { entity: placeholderEntity, entitySelection: placeholderSelection } = findPlaceholderAtCursor(editorState);
    const disabled = !!globallyDisabled || !selectionIsInOneBlock(editorState);

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
                    savedSelection={placeholderSelection}
                    onClose={() => setOpen(false)}
                />
            )}
        </ControlButton>
    );
}

interface PlaceholderDialogProps {
    placeholderEntity: EntityInstance | null;
    savedSelection: SelectionState | null;
    editorState: EditorState;
    setEditorState: (editorState: EditorState) => void;
    onClose: () => void;
}

function PlaceholderDialog({ onClose, placeholderEntity, savedSelection, editorState, setEditorState }: PlaceholderDialogProps) {
    const initialState: PlaceholderBlockState = placeholderEntity
        ? (placeholderEntity.getData() as PlaceholderBlockState)
        : PlaceholderBlock.defaultValues();
    const [state, setState] = useState<PlaceholderBlockState>(initialState);
    // Capture the selection at dialog open time — the dialog steals focus from Draft.js, collapsing the live selection
    const [selectionOnOpen] = useState(() => savedSelection ?? editorState.getSelection());

    const handleUpdate = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            if (!state.productId) return;
            const contentState = editorState.getCurrentContent();

            const label = getPlaceholderLabel(state);
            const contentStateWithEntity = contentState.createEntity(PLACEHOLDER_ENTITY_TYPE, "IMMUTABLE", state);
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

            if (placeholderEntity) {
                // Editing existing: use the saved entity selection to replace text
                const newContentState = Modifier.replaceText(contentStateWithEntity, selectionOnOpen, label, undefined, entityKey);
                setEditorState(EditorState.push(editorState, newContentState, "insert-characters"));
            } else {
                // Creating new: insert label text with entity at the cursor
                const newContentState = Modifier.insertText(contentStateWithEntity, selectionOnOpen, label, undefined, entityKey);
                setEditorState(EditorState.push(editorState, newContentState, "insert-characters"));
            }
            onClose();
        },
        [editorState, setEditorState, onClose, state, placeholderEntity, selectionOnOpen],
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
                <PlaceholderBlock.AdminComponent state={state} updateState={setState} isEditing={!!placeholderEntity} />
            </DialogContent>
            <DialogActions>
                <CancelButton onClick={onClose} />
                <OkayButton onClick={handleUpdate} disabled={!state.productId} />
            </DialogActions>
        </Dialog>
    );
}
