import { CancelButton, DeleteButton, OkayButton } from "@comet/admin";
// eslint-disable-next-line no-restricted-imports
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";
import type { Editor } from "@tiptap/react";
import { type MouseEvent, useState } from "react";
import { FormattedMessage } from "react-intl";

import type { BlockInterface, BlockState } from "../types";

interface TipTapChildBlockDialogProps {
    editor: Editor;
    block: BlockInterface;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    existingData?: any;
    nodePos?: number;
    onClose: () => void;
}

export function TipTapChildBlockDialog({ editor, block: Block, existingData, nodePos, onClose }: TipTapChildBlockDialogProps) {
    const isEditing = existingData != null && nodePos != null;

    const [blockState, setBlockState] = useState<BlockState<typeof Block>>(() => {
        if (existingData) {
            return existingData;
        }
        return Block.defaultValues();
    });

    const handleRemove = (e: MouseEvent) => {
        e.preventDefault();
        if (nodePos != null) {
            const tr = editor.state.tr;
            tr.delete(nodePos, nodePos + 1);
            editor.view.dispatch(tr);
            editor.commands.focus();
        }
        onClose();
    };

    const handleUpdate = (e: MouseEvent) => {
        e.preventDefault();
        if (isEditing && nodePos != null) {
            const tr = editor.state.tr;
            tr.setNodeMarkup(nodePos, undefined, { type: Block.name, data: blockState });
            editor.view.dispatch(tr);
            editor.commands.focus();
        } else {
            editor.chain().focus().insertChildBlock({ type: Block.name, data: blockState }).run();
        }
        onClose();
    };

    return (
        <Dialog onClose={onClose} open={true} maxWidth="sm" fullWidth>
            <DialogTitle>
                {isEditing ? (
                    <FormattedMessage
                        id="comet.blocks.tipTapRichText.editChildBlock"
                        defaultMessage="Edit {blockName}"
                        values={{ blockName: Block.displayName }}
                    />
                ) : (
                    <FormattedMessage
                        id="comet.blocks.tipTapRichText.insertChildBlock"
                        defaultMessage="Add {blockName}"
                        values={{ blockName: Block.displayName }}
                    />
                )}
            </DialogTitle>
            <DialogContent>
                <Block.AdminComponent state={blockState} updateState={setBlockState} />
            </DialogContent>
            <StyledDialogActions>
                <CancelButton onClick={onClose} />
                <ButtonContainer>
                    {isEditing && (
                        <DeleteButton onClick={handleRemove}>
                            <FormattedMessage id="comet.blocks.tipTapRichText.removeChildBlock" defaultMessage="Delete" />
                        </DeleteButton>
                    )}
                    <OkayButton onClick={handleUpdate} />
                </ButtonContainer>
            </StyledDialogActions>
        </Dialog>
    );
}

const StyledDialogActions = styled(DialogActions)`
    display: flex;
    flex-direction: column-reverse;
    align-items: stretch;
    gap: 10px;

    ${({ theme }) => theme.breakpoints.up("md")} {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 0;
    }
`;

const ButtonContainer = styled("div")`
    display: contents;

    ${({ theme }) => theme.breakpoints.up("md")} {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }
`;
