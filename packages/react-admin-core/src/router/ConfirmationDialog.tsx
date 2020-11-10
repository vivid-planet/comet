import { Button, Dialog, DialogActions, DialogTitle, Typography } from "@material-ui/core";
import * as React from "react";
import { FormattedMessage } from "react-intl";

interface IProps {
    isOpen: boolean;
    message: React.ReactNode; // typically a string or a FormattedMessage (intl) is passed
    handleClose: (ok: boolean) => void;
}

export const RouterConfirmationDialog: React.FunctionComponent<IProps> = ({ message, handleClose, isOpen }) => {
    return (
        <Dialog open={isOpen} onClose={handleClose.bind(this, false)}>
            <DialogTitle>{message}</DialogTitle>
            <DialogActions>
                <Button onClick={handleClose.bind(this, true)} color="primary" autoFocus={true}>
                    <Typography variant="button">
                        <FormattedMessage
                            id="reactAdmin.core.router.confirmationDialog.confirm"
                            defaultMessage="OK"
                            description="Confirmation Prompt OK"
                        />
                    </Typography>
                </Button>
                <Button onClick={handleClose.bind(this, false)} color="primary">
                    <Typography variant="button">
                        <FormattedMessage
                            id="reactAdmin.core.router.confirmationDialog.abort"
                            defaultMessage="Abbrechen"
                            description="Confirmation Prompt Abort"
                        />
                    </Typography>
                </Button>
            </DialogActions>
        </Dialog>
    );
};
