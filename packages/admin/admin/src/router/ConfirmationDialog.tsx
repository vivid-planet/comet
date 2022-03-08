import { Delete, Save } from "@comet/admin-icons";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { ToolbarFillSpace } from "..";
import { CancelButton } from "../common/buttons/cancel/CancelButton";

export enum PromptAction {
    Cancel,
    Discard,
    Save,
}

interface Props {
    isOpen: boolean;
    message: React.ReactNode; // typically a string or a FormattedMessage (intl) is passed
    handleClose: (action: PromptAction) => void;
    showSaveButton?: boolean;
}

export function RouterConfirmationDialog({ message, handleClose, isOpen, showSaveButton = false }: Props) {
    return (
        <Dialog open={isOpen} onClose={() => handleClose(PromptAction.Cancel)} maxWidth="sm">
            <DialogTitle>
                <FormattedMessage id="cometAdmin.generic.unsavedChanges" defaultMessage="Unsaved Changes" />
            </DialogTitle>
            <DialogContent>{message}</DialogContent>
            <DialogActions>
                <CancelButton onClick={() => handleClose(PromptAction.Cancel)} />
                <ToolbarFillSpace />
                <Button startIcon={<Delete />} color="default" variant="contained" onClick={() => handleClose(PromptAction.Discard)}>
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
