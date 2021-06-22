import { Dialog, DialogActions, DialogTitle } from "@material-ui/core";
import * as React from "react";

import { CancelButton } from "../common/buttons/cancel/CancelButton";
import { OkayButton } from "../common/buttons/okay/OkayButton";

interface Props {
    isOpen: boolean;
    message: React.ReactNode; // typically a string or a FormattedMessage (intl) is passed
    handleClose: (ok: boolean) => void;
}

export function RouterConfirmationDialog({ message, handleClose, isOpen }: Props) {
    return (
        <Dialog open={isOpen} onClose={handleClose.bind(this, false)} maxWidth={"xs"}>
            <DialogTitle>{message}</DialogTitle>
            <DialogActions>
                <CancelButton onClick={handleClose.bind(this, false)} />
                <OkayButton onClick={handleClose.bind(this, true)} autoFocus />
            </DialogActions>
        </Dialog>
    );
}
