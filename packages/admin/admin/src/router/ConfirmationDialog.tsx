import { Delete, Save, Warning } from "@comet/admin-icons";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Theme } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { ToolbarFillSpace } from "..";
import { CancelButton } from "../common/buttons/cancel/CancelButton";

export enum PromptAction {
    Cancel,
    Discard,
    Save,
}

export const WarningWrapper = styled("div")`
    display: flex;
    background: ${({ theme }: { theme: Theme }) => theme.palette.common.white};
    border: ${({ theme }: { theme: Theme }) => theme.palette.error.main} solid 1px;
    border-radius: 4px;
    padding: 20px;
    margin-bottom: 20px;
`;

export const WarningIcon = styled(Warning)`
    font-size: 20px;
    color: ${({ theme }: { theme: Theme }) => theme.palette.error.dark};
`;

export const WarningTextWrapper = styled("div")`
    padding-left: 10px;
`;

interface Props {
    isOpen: boolean;
    warning?: React.ReactNode;
    message?: React.ReactNode; // typically a string or a FormattedMessage (intl) is passed
    handleClose: (action: PromptAction) => void;
    showSaveButton?: boolean;
}

export function RouterConfirmationDialog({ warning, message, handleClose, isOpen, showSaveButton = false }: Props) {
    return (
        <Dialog open={isOpen} onClose={() => handleClose(PromptAction.Cancel)} maxWidth="sm">
            <DialogTitle>
                <FormattedMessage id="cometAdmin.generic.unsavedChanges" defaultMessage="Unsaved Changes" />
            </DialogTitle>
            <DialogContent>
                <WarningWrapper>
                    <WarningIcon />
                    <WarningTextWrapper>
                        {warning ?? (
                            <FormattedMessage id="cometAdmin.generic.doYouWantToSaveYourChanges" defaultMessage="Do you want to save your changes?" />
                        )}
                    </WarningTextWrapper>
                </WarningWrapper>
                {message ?? (
                    <FormattedMessage
                        id="cometAdmin.generic.yourChangesWillBeLost"
                        defaultMessage="Your changes will be lost if you don't save them."
                    />
                )}
            </DialogContent>
            <DialogActions>
                <CancelButton variant="outlined" onClick={() => handleClose(PromptAction.Cancel)} startIcon={null}>
                    <FormattedMessage id="cometAdmin.generic.continueEditing" defaultMessage="Continue editing" />
                </CancelButton>
                <ToolbarFillSpace />
                <Button startIcon={<Delete />} color="error" variant="contained" onClick={() => handleClose(PromptAction.Discard)}>
                    <FormattedMessage id="cometAdmin.generic.discard" defaultMessage="Discard" />
                </Button>
                {showSaveButton && (
                    <Button startIcon={<Save />} color="primary" variant="contained" onClick={() => handleClose(PromptAction.Save)}>
                        <FormattedMessage id="cometAdmin.generic.save" defaultMessage="Save" />
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
