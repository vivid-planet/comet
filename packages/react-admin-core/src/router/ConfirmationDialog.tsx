import { Button,Dialog,DialogActions ,DialogTitle,Typography} from "@material-ui/core";
import * as React from "react";

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
                    <Typography variant="button">OK</Typography>
                </Button>
                <Button onClick={handleClose.bind(this, false)} color="primary">
                    <Typography variant="button">Abbrechen</Typography>
                </Button>
            </DialogActions>
        </Dialog>
    );
};
