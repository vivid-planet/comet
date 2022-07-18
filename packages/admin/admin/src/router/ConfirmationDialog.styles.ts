import { createStyles } from "@mui/styles";

import { RouterConfirmationDialogProps } from "./ConfirmationDialog";

export type RouterConfirmationDialogClassKey = "root" | "closeButton" | "actionButton" | "saveButton" | "discardButton";

export const styles = () => {
    return createStyles<RouterConfirmationDialogClassKey, RouterConfirmationDialogProps>({
        root: {
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
        actionButton: {
            minWidth: "47%",
        },
        saveButton: {},
        discardButton: {},
    });
};
