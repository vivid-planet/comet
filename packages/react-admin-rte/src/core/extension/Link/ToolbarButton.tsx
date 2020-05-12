import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import LinkIcon from "@material-ui/icons/Link";
import { EditorState, RichUtils } from "draft-js";
import * as React from "react";
import ControlButton from "../../Controls/ControlButton";
import { IControlProps } from "../../types";
import findEntityDataInCurrentSelection from "../../utils/findEntityDataInCurrentSelection";
import findEntityInCurrentSelection from "../../utils/findEntityInCurrentSelection";
import selectionIsInOneBlock from "../../utils/selectionIsInOneBlock";
import { ENTITY_TYPE } from "./Decorator";
import { ILinkProps } from "./EditorComponent";

export default function ToolbarButton(props: IControlProps) {
    const [open, setOpen] = React.useState(false);
    const linkData = findEntityDataInCurrentSelection<ILinkProps>(props.editorState, ENTITY_TYPE);
    const { entity: previousLinkEntity, entitySelection: linkEntitySelection } = findEntityInCurrentSelection(props.editorState, ENTITY_TYPE);
    const selection = props.editorState.getSelection();
    const linkEditCreateDisabled = (selection.isCollapsed() && !linkData) || !selectionIsInOneBlock(props.editorState);

    function handleClick(e: React.MouseEvent) {
        if (linkEditCreateDisabled) {
            return;
        }
        if (previousLinkEntity && linkEntitySelection) {
            // when there is a previous LINK entity found in the selection, force-shrink the selection to the text of this link entity
            // like this we avoid nested links
            props.setEditorState(EditorState.forceSelection(props.editorState, linkEntitySelection));
        }

        setOpen(true);
    }

    return (
        <ControlButton selected={!!linkData} disabled={linkEditCreateDisabled} Icon={LinkIcon} onButtonClick={handleClick} colors={props.colors}>
            <LinkDialog
                editorState={props.editorState}
                onChange={props.setEditorState}
                linkData={linkData}
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
            />
        </ControlButton>
    );
}

function LinkDialog(props: {
    open: boolean;
    onClose: () => void;
    linkData: ILinkProps | null;
    editorState: EditorState;
    onChange: (editorState: EditorState) => void;
}) {
    const { onClose, open, linkData, editorState, onChange } = props;
    const linkDataUrl = linkData ? linkData.url : "";
    const [newUrl, setNewUrl] = React.useState(linkDataUrl);

    React.useEffect(() => {
        setNewUrl(linkDataUrl);
    }, [linkDataUrl, setNewUrl]);

    const handleClose = () => {
        onClose();
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();

        setNewUrl("");
        const selection = editorState.getSelection();
        if (!selection.isCollapsed()) {
            onChange(RichUtils.toggleLink(editorState, selection, null));
        }
        onClose();
    };

    const handleUpdate = (e: React.MouseEvent) => {
        e.preventDefault();
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity("LINK", "MUTABLE", { url: newUrl });
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(editorState, {
            currentContent: contentStateWithEntity,
        });

        onChange(RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey));

        onClose();
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle>Link</DialogTitle>
            <DialogContent>
                <TextField
                    // autoFocus
                    label="Url"
                    variant="outlined"
                    value={newUrl}
                    onChange={e => {
                        setNewUrl(e.target.value);
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="default">
                    Abbrechen
                </Button>
                {linkData && (
                    <Button onClick={handleRemove} color="primary">
                        Entfernen
                    </Button>
                )}

                {newUrl && (
                    <Button onClick={handleUpdate} color="primary">
                        Ok
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
