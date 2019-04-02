import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import * as React from "react";

interface IProps {
    isOpen: boolean;
    message: string;
    handleClose: (ok: boolean) => void;
}
const ConfirmationDialog: React.FunctionComponent<IProps> = ({ message, handleClose, isOpen }) => {
    return (
        <Dialog open={isOpen} onClose={handleClose.bind(this, false)}>
            <DialogTitle>{message}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose.bind(this, true)} color="primary" autoFocus={true}>
                    OK
                </Button>
                <Button onClick={handleClose.bind(this, false)} color="primary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default ConfirmationDialog;
