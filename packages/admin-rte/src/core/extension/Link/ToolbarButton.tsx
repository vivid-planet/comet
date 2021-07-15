import { CancelButton, DeleteButton, SaveButton } from "@comet/admin";
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@material-ui/core";
import LinkIcon from "@material-ui/icons/Link";
import { EditorState, RichUtils } from "draft-js";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

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
    const globallyDisabled = !!props.disabled;

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
        <ControlButton selected={!!linkData} disabled={linkEditCreateDisabled || globallyDisabled} icon={LinkIcon} onButtonClick={handleClick}>
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

    const intl = useIntl();

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
            <DialogTitle>
                <FormattedMessage id={"cometAdmin.rte.extensions.link.editDialogTitle"} defaultMessage={"Link"} />
            </DialogTitle>
            <DialogContent>
                <TextField
                    // autoFocus
                    label={intl.formatMessage({ id: "cometAdmin.rte.extensions.link.url", defaultMessage: "Url" })}
                    variant="outlined"
                    value={newUrl}
                    onChange={(e) => {
                        setNewUrl(e.target.value);
                    }}
                />
            </DialogContent>
            <DialogActions>
                <CancelButton onClick={handleClose} />
                <div>
                    <Grid container spacing={4}>
                        {linkData && (
                            <Grid item>
                                <DeleteButton onClick={handleRemove} />
                            </Grid>
                        )}
                        <Grid item>
                            <SaveButton onClick={handleUpdate} disabled={!newUrl} />
                        </Grid>
                    </Grid>
                </div>
            </DialogActions>
        </Dialog>
    );
}
