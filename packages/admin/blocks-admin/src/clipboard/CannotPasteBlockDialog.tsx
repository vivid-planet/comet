import { OkayButton } from "@comet/admin";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
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
                <OkayButton onClick={onClose} variant="textDark" />
            </DialogActions>
        </Dialog>
    );
};

export { CannotPasteBlockDialog };
