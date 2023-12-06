import { Theme } from "@mui/material";
import { createStyles } from "@mui/styles";

import { RouterConfirmationDialogProps } from "./ConfirmationDialog";

export type RouterConfirmationDialogClassKey =
    | "root"
    | "closeButton"
    | "messageWrapper"
    | "messageWarningIcon"
    | "messageText"
    | "actionButton"
    | "saveButton"
    | "discardButton";

export const styles = (theme: Theme) => {
    return createStyles<RouterConfirmationDialogClassKey, RouterConfirmationDialogProps>({
        root: {
            zIndex: 1301,
        },
        closeButton: {
            position: "absolute",
            right: 14,
            top: 14,
            color: "#fff",
        },
        messageWrapper: {
            display: "flex",
        },
        messageWarningIcon: { fontSize: 20 },
        messageText: { paddingLeft: 10 },
        actionButton: {
            flexGrow: 1,
            flexBasis: "50%",
        },
        saveButton: {
            marginLeft: theme.spacing(2),
        },
        discardButton: {
            marginRight: theme.spacing(2),
        },
    });
};
