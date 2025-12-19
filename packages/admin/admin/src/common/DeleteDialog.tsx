import { Delete as DeleteIcon, Remove as RemoveIcon,WarningSolid } from "@comet/admin-icons";
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
    deleteType?: "delete" | "remove";
    onDelete: () => Promise<void>;
    onCancel: () => void;
}

export const DeleteDialog = (props: DeleteDialogProps) => {
    const { dialogOpen, deleteType = "delete", onDelete, onCancel } = props;

    return (
        <Dialog open={dialogOpen} onClose={onCancel} maxWidth="sm">
            <DialogTitle>
                { deleteType === "delete" ? <FormattedMessage id="comet.table.deleteDialog.title" defaultMessage="Attention. Please confirm." /> : <FormattedMessage id="comet.common.deleteDialog.titleRemove" defaultMessage="Please confirm." /> }
            </DialogTitle>
            <DialogContent sx={{ gap: (theme) => theme.spacing(2), display: "flex", alignItems: "center" }}>
                <WarningSolid color="error" />
                {deleteType === "delete" ? <FormattedMessage id="comet.table.deleteDialog.content" defaultMessage="You are about to delete this item permanently." /> : <FormattedMessage id="comet.common.deleteDialog.contentRemove" defaultMessage="You are about to remove this item." />}
            </DialogContent>
            <DialogActions>
                <CancelButton onClick={onCancel} />
                <FeedbackButton
                    startIcon={deleteType === "delete" ? <DeleteIcon /> : <RemoveIcon />}
                    onClick={onDelete}
                    variant="destructive"
                    tooltipErrorMessage={deleteType === "delete" ? <FormattedMessage id="comet.common.deleteFailed" defaultMessage="Failed to delete" /> : <FormattedMessage id="comet.common.removeFailed" defaultMessage="Failed to remove" />}
                >
                    <FormattedMessage {...(deleteType === "delete" ? messages.delete : messages.remove)} />
                </FeedbackButton>
            </DialogActions>
        </Dialog>
    );
};
