import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

interface Props {
    open: boolean;
    onClose: () => void;
    error: React.ReactNode;
}

function CannotPasteBlockDialog({ open, onClose, error }: Props): React.ReactElement {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <FormattedMessage id="comet.blocks.cannotPasteBlock.title" defaultMessage="Can't paste block" />
            </DialogTitle>
            <DialogContent>{error}</DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="info">
                    <FormattedMessage id="comet.generic.ok" defaultMessage="OK" />
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export { CannotPasteBlockDialog };
