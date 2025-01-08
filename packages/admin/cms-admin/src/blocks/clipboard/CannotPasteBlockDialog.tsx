import { messages } from "@comet/admin";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { ReactNode } from "react";
import { FormattedMessage } from "react-intl";

interface Props {
    open: boolean;
    onClose: () => void;
    error: ReactNode;
}

const CannotPasteBlockDialog = ({ open, onClose, error }: Props) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <FormattedMessage id="comet.blocks.cannotPasteBlock.title" defaultMessage="Can't paste block" />
            </DialogTitle>
            <DialogContent>{error}</DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="info">
                    <FormattedMessage {...messages.ok} />
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export { CannotPasteBlockDialog };
