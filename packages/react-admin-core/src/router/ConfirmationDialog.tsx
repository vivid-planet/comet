import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import * as React from "react";
import { FormattedMessage } from "react-intl";

interface IProps {
    isOpen: boolean;
    message: string;
    handleClose: (ok: boolean) => void;
}

export const RouterConfirmationDialog: React.FunctionComponent<IProps> = ({ message, handleClose, isOpen }) => {
    return (
        <Dialog open={isOpen} onClose={handleClose.bind(this, false)}>
            <DialogTitle>{message}</DialogTitle>
            <DialogActions>
                <Button onClick={handleClose.bind(this, true)} color="primary" autoFocus={true}>
                    <FormattedMessage
                        id="reactAdmin.core.router.confirmationDialog.confirm"
                        defaultMessage="OK"
                        description="Confirmation Prompt OK"
                    />
                </Button>
                <Button onClick={handleClose.bind(this, false)} color="primary">
                    <FormattedMessage
                        id="reactAdmin.core.router.confirmationDialog.abort"
                        defaultMessage="Abbrechen"
                        description="Confirmation Prompt Abort"
                    />
                </Button>
            </DialogActions>
        </Dialog>
    );
};
