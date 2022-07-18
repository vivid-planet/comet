import { createStyles } from "@mui/styles";

import { RouterConfirmationDialogProps } from "./ConfirmationDialog";

export type RouterConfirmationDialogClassKey =
    | "dialog"
    | "closeButton"
    | "messageWrapper"
    | "messageWarningIcon"
    | "messageText"
    | "actionButton"
    | "saveButton"
    | "discardButton";

export const styles = () => {
    return createStyles<RouterConfirmationDialogClassKey, RouterConfirmationDialogProps>({
        dialog: {
            "& .MuiDialog-paper": {
                maxWidth: "25vw",
            },
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
            minWidth: "47%",
        },
        saveButton: {},
        discardButton: {},
    });
};
