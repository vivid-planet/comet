import { messages } from "@comet/admin";
import { Link } from "@comet/admin-icons";
import { ControlButton, findEntityInCurrentSelection, findTextInCurrentSelection, selectionIsInOneBlock } from "@comet/admin-rte";
import { BlockInterface, BlockState } from "@comet/blocks-admin";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { EditorState, EntityInstance, RichUtils } from "draft-js";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { ENTITY_TYPE } from "./Decorator";

interface IProps {
    editorState: EditorState;
    setEditorState: (editorState: EditorState) => void;
}

interface CreateCmsLinkToolbarButtonOptions {
    link: BlockInterface;
}

export function createCmsLinkToolbarButton({ link: LinkBlock }: CreateCmsLinkToolbarButtonOptions): (props: IProps) => React.ReactElement {
    function ToolbarButton({ editorState, setEditorState }: IProps): React.ReactElement {
        const [open, setOpen] = React.useState(false);
        const { entity: linkEntity, entitySelection: linkSelection } = findEntityInCurrentSelection(editorState, ENTITY_TYPE);
        const selection = editorState.getSelection();
        const linkEditCreateDisabled = !linkEntity && (selection.isCollapsed() || !selectionIsInOneBlock(editorState)); // when a link entity is found it is always editable, when no entity is found, creating a link is disabled when no char is selected (selection.isCollapsed()) or when the selection exceeds a block (a link over multiple blocks is normally not intended)
        const selectedText = findTextInCurrentSelection(editorState);

        function handleClick() {
            // when multiple blocks are selected making a link is disabled
            if (linkEditCreateDisabled) {
                return;
            }
            if (linkEntity && linkSelection) {
                // when there is a previous LINK entity found in the selection, force-shrink the selection to the text of this link entity
                setEditorState(EditorState.forceSelection(editorState, linkSelection));
            }
            setOpen(true);
        }
        return (
            <ControlButton disabled={linkEditCreateDisabled} onButtonClick={handleClick} Icon={Link}>
                {open && (
                    <LinkDialog
                        editorState={editorState}
                        setEditorState={setEditorState}
                        linkEntity={linkEntity}
                        selectedText={selectedText}
                        onClose={() => {
                            setOpen(false);
                        }}
                    />
                )}
            </ControlButton>
        );
    }

    interface ILinkDialogProps {
        onClose: () => void;
        linkEntity: EntityInstance | null;
        selectedText: string;
        editorState: EditorState;
        setEditorState: (editorState: EditorState) => void;
    }
    function LinkDialog({ onClose, linkEntity, editorState, setEditorState, selectedText }: ILinkDialogProps) {
        // provides the form inputs

        const linkState: BlockState<typeof LinkBlock> = React.useMemo(() => {
            if (linkEntity) {
                // editing link, create a clone to edit in dialog (as the user might cancel editing)
                return linkEntity.getData() as BlockState<typeof LinkBlock>;
            } else {
                // no link in selection, create a new link
                return LinkBlock.defaultValues();
            }
        }, [linkEntity]);

        const [newLinkState, setNewLinkState] = React.useState<BlockState<typeof LinkBlock>>(linkState);

        const handleClose = () => {
            onClose();
        };

        // removes the selected link entity
        const handleRemove = React.useCallback(
            (e: React.MouseEvent) => {
                e.preventDefault();

                const selection = editorState.getSelection();
                if (!selection.isCollapsed()) {
                    setEditorState(RichUtils.toggleLink(editorState, selection, null));
                }
                onClose();
            },
            [editorState, onClose, setEditorState],
        );

        // creates or updates the draft link entity
        const handleUpdate = React.useCallback(
            (e: React.MouseEvent) => {
                e.preventDefault();
                const selection = editorState.getSelection();
                // update the data in the entity
                const contentState = editorState.getCurrentContent();
                const contentStateWithEntity = contentState.createEntity(ENTITY_TYPE, "MUTABLE", newLinkState);
                const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
                const newEditorState = EditorState.push(editorState, contentStateWithEntity, "apply-entity");
                setEditorState(RichUtils.toggleLink(newEditorState, selection, entityKey));

                onClose();
            },
            [editorState, setEditorState, onClose, newLinkState],
        );

        return (
            <Dialog onClose={handleClose} open={true}>
                <DialogTitle>
                    {linkEntity ? (
                        <FormattedMessage
                            id="comet.rteExtensions.cmsLink.editLink"
                            defaultMessage='Edit link "{link}"'
                            values={{ link: selectedText }}
                        />
                    ) : (
                        <FormattedMessage id="comet.rteExtensions.cmsLink.insertLink" defaultMessage="Insert link" />
                    )}
                </DialogTitle>
                <DialogContent>
                    <LinkBlock.AdminComponent state={newLinkState} updateState={setNewLinkState} />
                </DialogContent>
                <DialogActions>
                    {linkEntity && (
                        <Button onClick={handleRemove} color="primary">
                            <FormattedMessage id="comet.rteExtensions.cmsLink.removeLink" defaultMessage="Delete Link" />
                        </Button>
                    )}
                    <Button onClick={handleUpdate} color="primary">
                        <FormattedMessage {...messages.ok} />
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        <FormattedMessage {...messages.cancel} />
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    return ToolbarButton;
}
