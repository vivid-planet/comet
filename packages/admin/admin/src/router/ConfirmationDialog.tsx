import { Close, Delete, Save, Warning } from "@comet/admin-icons";
import { Button, ComponentsOverrides, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Theme, Typography } from "@mui/material";
import { css, styled, useThemeProps } from "@mui/material/styles";
import { ThemedComponentBaseProps } from "helpers/ThemedComponentBaseProps";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "../messages";

export type RouterConfirmationDialogClassKey =
    | "root"
    | "closeButton"
    | "messageWrapper"
    | "messageWarningIcon"
    | "messageText"
    | "actionButton"
    | "saveButton"
    | "discardButton";

const StyledDialog = styled(Dialog, {
    name: "CometAdminRouterConfirmationDialog",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})(css`
    z-index: 1301;
`);

const CloseButton = styled(IconButton, {
    name: "CometAdminRouterConfirmationDialog",
    slot: "closeButton",
    overridesResolver(_, styles) {
        return [styles.closeButton];
    },
})(css`
    position: absolute;
    right: 14px;
    top: 14px;
    color: #fff;
`);

const MessageWrapper = styled("div", {
    name: "CometAdminRouterConfirmationDialog",
    slot: "messageWrapper",
    overridesResolver(_, styles) {
        return [styles.messageWrapper];
    },
})(css`
    display: flex;
`);

const StyledWarning = styled(Warning, {
    name: "CometAdminRouterConfirmationDialog",
    slot: "messageWarningIcon",
    overridesResolver(_, styles) {
        return [styles.messageWarningIcon];
    },
})(css`
    font-size: 20px;
`);

const MessageText = styled(Typography, {
    name: "CometAdminRouterConfirmationDialog",
    slot: "messageText",
    overridesResolver(_, styles) {
        return [styles.messageText];
    },
})(css`
    padding-left: 10px;
`);

const SaveButton = styled(Button, {
    name: "CometAdminRouterConfirmationDialog",
    slot: "saveButton",
    overridesResolver(_, styles) {
        return [styles.actionButton, styles.saveButton];
    },
})(
    ({ theme }) => css`
        flex-grow: 1;
        flex-basis: 50%;
        margin-left: ${theme.spacing(2)};
    `,
);

const DiscardButton = styled(Button, {
    name: "CometAdminRouterConfirmationDialog",
    slot: "discardButton",
    overridesResolver(_, styles) {
        return [styles.actionButton, styles.discardButton];
    },
})(
    ({ theme }) => css`
        flex-grow: 1;
        flex-basis: 50%;
        margin-right: ${theme.spacing(2)};
    `,
);
export enum PromptAction {
    Cancel,
    Discard,
    Save,
}

export interface RouterConfirmationDialogProps
    extends ThemedComponentBaseProps<{
        root: typeof Dialog;
        closeButton: typeof IconButton;
        messageWrapper: "div";
        messageWarningIcon: typeof Warning;
        messageText: typeof Typography;
        saveButton: typeof Button;
        discardButton: typeof Button;
    }> {
    isOpen: boolean;
    message?: React.ReactNode; // typically a string or a FormattedMessage (intl) is passed
    handleClose: (action: PromptAction) => void;
    showSaveButton?: boolean;
}

export function RouterConfirmationDialog(inProps: RouterConfirmationDialogProps) {
    const {
        message,
        handleClose,
        isOpen,
        showSaveButton = false,
        slotProps,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminRouterConfirmationDialog" });

    return (
        <StyledDialog open={isOpen} onClose={() => handleClose(PromptAction.Cancel)} maxWidth="sm" {...slotProps?.root} {...restProps}>
            <DialogTitle>
                <FormattedMessage {...messages.saveUnsavedChanges} />
                <CloseButton onClick={() => handleClose(PromptAction.Cancel)} {...slotProps?.closeButton}>
                    <Close />
                </CloseButton>
            </DialogTitle>
            <DialogContent>
                <MessageWrapper {...slotProps?.messageWrapper}>
                    <StyledWarning {...slotProps?.messageWarningIcon} />
                    <MessageText {...slotProps?.messageText}>{message ?? <FormattedMessage {...messages.saveUnsavedChanges} />}</MessageText>
                </MessageWrapper>
            </DialogContent>
            <DialogActions>
                <DiscardButton
                    startIcon={<Delete />}
                    color="error"
                    variant="outlined"
                    onClick={() => handleClose(PromptAction.Discard)}
                    {...slotProps?.discardButton}
                >
                    <FormattedMessage {...messages.discard} />
                </DiscardButton>
                {showSaveButton && (
                    <SaveButton
                        startIcon={<Save />}
                        color="primary"
                        variant="contained"
                        onClick={() => handleClose(PromptAction.Save)}
                        {...slotProps?.saveButton}
                    >
                        <FormattedMessage {...messages.save} />
                    </SaveButton>
                )}
            </DialogActions>
        </StyledDialog>
    );
}

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
