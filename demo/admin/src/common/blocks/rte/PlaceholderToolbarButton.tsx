import { CancelButton, Dialog, OkayButton } from "@comet/admin";
import { RteTextPlaceholder } from "@comet/admin-icons";
import { ControlButton, findEntityInCurrentSelection, selectionIsInOneBlock } from "@comet/admin-rte";
import { DialogActions, DialogContent } from "@mui/material";
import { EditorState, RichUtils } from "draft-js";
import { type ReactElement, useCallback, useState } from "react";
import { FormattedMessage } from "react-intl";

import { PlaceholderBlock } from "../PlaceholderBlock";
import { PLACEHOLDER_ENTITY_TYPE } from "./PlaceholderDecorator";

interface PlaceholderToolbarButtonProps {
    editorState: EditorState;
    setEditorState: (editorState: EditorState) => void;
}

export function PlaceholderToolbarButton({ editorState, setEditorState }: PlaceholderToolbarButtonProps): ReactElement {
    const [open, setOpen] = useState(false);
    const { entity: placeholderEntity, entitySelection: placeholderSelection } = findEntityInCurrentSelection(editorState, PLACEHOLDER_ENTITY_TYPE);
    const selection = editorState.getSelection();
    const disabled = !placeholderEntity && (selection.isCollapsed() || !selectionIsInOneBlock(editorState));

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
        <ControlButton disabled={disabled} onButtonClick={handleClick} icon={RteTextPlaceholder}>
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
            const selection = editorState.getSelection();
            const contentState = editorState.getCurrentContent();
            const contentStateWithEntity = contentState.createEntity(PLACEHOLDER_ENTITY_TYPE, "MUTABLE", state);
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            const newEditorState = EditorState.push(editorState, contentStateWithEntity, "apply-entity");
            setEditorState(RichUtils.toggleLink(newEditorState, selection, entityKey));
            onClose();
        },
        [editorState, setEditorState, onClose, state],
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
