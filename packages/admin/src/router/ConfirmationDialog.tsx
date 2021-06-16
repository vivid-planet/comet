import { Dialog, DialogActions, DialogClassKey, DialogTitle, makeStyles } from "@material-ui/core";
import { StyledComponentProps, Theme } from "@material-ui/core/styles";
import * as React from "react";

import { CancelButton } from "../common/buttons/cancel/CancelButton";
import { OkayButton } from "../common/buttons/okay/OkayButton";
import { mergeClasses } from "../helpers/mergeClasses";

interface Props {
    isOpen: boolean;
    message: React.ReactNode; // typically a string or a FormattedMessage (intl) is passed
    handleClose: (ok: boolean) => void;
}

export function RouterConfirmationDialog({
    message,
    handleClose,
    isOpen,
    classes: passedClasses,
}: Props & StyledComponentProps<CometAdminFormSectionKeys>) {
    const classes = mergeClasses<CometAdminFormSectionKeys>(useStyles(), passedClasses);
    return (
        <Dialog open={isOpen} onClose={handleClose.bind(this, false)} classes={classes}>
            <DialogTitle>{message}</DialogTitle>
            <DialogActions>
                <CancelButton onClick={handleClose.bind(this, false)} />
                <OkayButton onClick={handleClose.bind(this, true)} autoFocus />
            </DialogActions>
        </Dialog>
    );
}

export type CometAdminFormSectionKeys = DialogClassKey;

const useStyles = makeStyles<Theme, {}, CometAdminFormSectionKeys>(
    () => ({
        root: {},
        scrollPaper: {},
        scrollBody: {},
        container: {},
        paper: {},
        paperScrollPaper: {},
        paperScrollBody: {},
        paperWidthFalse: {},
        paperWidthXs: {},
        paperWidthSm: {
            width: 350,
        },
        paperWidthMd: {},
        paperWidthLg: {},
        paperWidthXl: {},
        paperFullWidth: {},
        paperFullScreen: {},
    }),
    { name: "CometAdminRouterConfirmationDialog" },
);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminRouterConfirmationDialog: CometAdminFormSectionKeys;
    }
}
