import { Close, Delete, Save, Warning } from "@comet/admin-icons";
import { Button, ComponentsOverrides, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Theme, Typography } from "@mui/material";
import { WithStyles, withStyles } from "@mui/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "../messages";
import { RouterConfirmationDialogClassKey, styles } from "./ConfirmationDialog.styles";

export enum PromptAction {
    Cancel,
    Discard,
    Save,
}

export interface RouterConfirmationDialogProps {
    isOpen: boolean;
    message?: React.ReactNode; // typically a string or a FormattedMessage (intl) is passed
    handleClose: (action: PromptAction) => void;
    showSaveButton?: boolean;
}

export function InternalRouterConfirmationDialog({
    message,
    handleClose,
    isOpen,
    showSaveButton = false,
    classes,
}: RouterConfirmationDialogProps & WithStyles<typeof styles>) {
    return (
        <Dialog open={isOpen} onClose={() => handleClose(PromptAction.Cancel)} maxWidth="sm" className={classes.root}>
            <DialogTitle>
                <FormattedMessage {...messages.saveUnsavedChanges} />
                <IconButton onClick={() => handleClose(PromptAction.Cancel)} className={classes.closeButton}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <div className={classes.messageWrapper}>
                    <Warning className={classes.messageWarningIcon} />
                    <Typography className={classes.messageText}>{message ?? <FormattedMessage {...messages.saveUnsavedChanges} />}</Typography>
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    startIcon={<Delete />}
                    color="error"
                    variant="outlined"
                    onClick={() => handleClose(PromptAction.Discard)}
                    className={`${classes.actionButton} ${classes.discardButton}`}
                >
                    <FormattedMessage {...messages.discard} />
                </Button>
                {showSaveButton && (
                    <Button
                        startIcon={<Save />}
                        color="primary"
                        variant="contained"
                        onClick={() => handleClose(PromptAction.Save)}
                        className={`${classes.actionButton} ${classes.saveButton}`}
                    >
                        <FormattedMessage {...messages.save} />
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}

export const RouterConfirmationDialog = withStyles(styles, { name: "CometAdminRouterConfirmationDialog" })(InternalRouterConfirmationDialog);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminRouterConfirmationDialog: RouterConfirmationDialogClassKey;
    }

    interface Components {
        CometAdminRouterConfirmationDialog?: {
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminRouterConfirmationDialog"];
        };
    }
}
