import { Close, Delete, Save, Warning } from "@comet/admin-icons";
import { Button, ComponentsOverrides, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Theme, Typography } from "@mui/material";
import { css, useThemeProps } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { createSlot } from "../helpers/createSlot";
import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";
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

const StyledDialog = createSlot(Dialog)<RouterConfirmationDialogClassKey>({
    componentName: "RouterConfirmationDialog",
    slotName: "root",
})(css`
    z-index: 1301;
`);

const CloseButton = createSlot(IconButton)<RouterConfirmationDialogClassKey>({
    componentName: "RouterConfirmationDialog",
    slotName: "closeButton",
})(css`
    position: absolute;
    right: 14px;
    top: 14px;
    color: #fff;
`);

const MessageWrapper = createSlot("div")<RouterConfirmationDialogClassKey>({
    componentName: "RouterConfirmationDialog",
    slotName: "messageWrapper",
})(css`
    display: flex;
`);

const StyledWarning = createSlot(Warning)<RouterConfirmationDialogClassKey>({
    componentName: "RouterConfirmationDialog",
    slotName: "messageWarningIcon",
})(css`
    font-size: 20px;
`);

const MessageText = createSlot(Typography)<RouterConfirmationDialogClassKey>({
    componentName: "RouterConfirmationDialog",
    slotName: "messageText",
})(css`
    padding-left: 10px;
`);

const SaveButton = createSlot(Button)<RouterConfirmationDialogClassKey>({
    componentName: "RouterConfirmationDialog",
    slotName: "saveButton",
    classesResolver() {
        return ["actionButton"];
    },
})(
    ({ theme }) => css`
        flex-grow: 1;
        flex-basis: 50%;
        margin-left: ${theme.spacing(2)};
    `,
);

const DiscardButton = createSlot(Button)<RouterConfirmationDialogClassKey>({
    componentName: "RouterConfirmationDialog",
    slotName: "discardButton",
    classesResolver() {
        return ["actionButton"];
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
