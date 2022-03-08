import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import * as React from "react";
import { FormattedMessage } from "react-intl";

export interface PageCanNotDeleteDialogProps {
    dialogOpen: boolean;
    onClosePressed: () => void;
}

export const PageCanNotDeleteDialog: React.FunctionComponent<PageCanNotDeleteDialogProps> = (props) => {
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
                <Button onClick={onClosePressed} color="primary">
                    <FormattedMessage id="cometAdmin.generic.close" defaultMessage="Close" />
                </Button>
            </DialogActions>
        </Dialog>
    );
};
