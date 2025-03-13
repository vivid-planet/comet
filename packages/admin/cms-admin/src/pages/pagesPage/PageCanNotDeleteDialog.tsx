import { Button, messages } from "@comet/admin";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { FormattedMessage } from "react-intl";

export interface PageCanNotDeleteDialogProps {
    dialogOpen: boolean;
    onClosePressed: () => void;
}

export const PageCanNotDeleteDialog = (props: PageCanNotDeleteDialogProps) => {
    const { dialogOpen, onClosePressed } = props;

    return (
        <Dialog open={dialogOpen} onClose={onClosePressed}>
            <DialogTitle>
                <FormattedMessage id="comet.pages.pages.page.canNotDeleteDialog.title" defaultMessage="Can not delete selected pages." />
            </DialogTitle>
            <DialogContent>
                <FormattedMessage
                    id="comet.pages.pages.page.canNotDeleteDialog.content"
                    defaultMessage="WARNING: You can not delete the selected pages, because you have not fully selected all sub pages."
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClosePressed} variant="textDark">
                    <FormattedMessage {...messages.close} />
                </Button>
            </DialogActions>
        </Dialog>
    );
};
