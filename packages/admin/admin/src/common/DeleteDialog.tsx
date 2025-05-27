import { Delete as DeleteIcon, WarningSolid } from "@comet/admin-icons";
import {
    // eslint-disable-next-line no-restricted-imports
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { FormattedMessage } from "react-intl";

import { messages } from "../messages";
import { CancelButton } from "./buttons/cancel/CancelButton";
import { FeedbackButton } from "./buttons/feedback/FeedbackButton";

interface DeleteDialogProps {
    dialogOpen: boolean;
    onDelete: () => Promise<void>;
    onCancel: () => void;
}

export const DeleteDialog = (props: DeleteDialogProps) => {
    const { dialogOpen, onDelete, onCancel } = props;

    return (
        <Dialog open={dialogOpen} onClose={onCancel} maxWidth="sm">
            <DialogTitle>
                <FormattedMessage id="comet.table.deleteDialog.title" defaultMessage="Attention. Please confirm." />
            </DialogTitle>
            <DialogContent sx={{ gap: (theme) => theme.spacing(2), display: "flex", alignItems: "center" }}>
                <WarningSolid color="error" />
                <FormattedMessage id="comet.table.deleteDialog.content" defaultMessage="You are about to delete this item permanently." />
            </DialogContent>
            <DialogActions>
                <CancelButton onClick={onCancel} />
                <FeedbackButton
                    startIcon={<DeleteIcon />}
                    onClick={onDelete}
                    variant="destructive"
                    tooltipErrorMessage={<FormattedMessage id="comet.common.deleteFailed" defaultMessage="Failed to delete" />}
                >
                    <FormattedMessage {...messages.delete} />
                </FeedbackButton>
            </DialogActions>
        </Dialog>
    );
};
