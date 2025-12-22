import { CancelButton, Dialog, SaveBoundary, SaveBoundarySaveButton } from "@comet/admin";
import { DialogActions, DialogContent } from "@mui/material";
import { type PropsWithChildren, type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

type Props = {
    onDialogClose: () => void;
    open: boolean;
    title?: ReactNode;
};

export const AssignDialog = ({ onDialogClose, open, children, title }: PropsWithChildren<Props>) => {
    return (
        <SaveBoundary
            onAfterSave={() => {
                onDialogClose();
            }}
        >
            <Dialog
                open={open}
                onClose={() => {
                    onDialogClose();
                }}
                maxWidth="lg"
                title={title}
            >
                <DialogContent>{children}</DialogContent>

                <DialogActions>
                    <CancelButton
                        onClick={() => {
                            onDialogClose();
                        }}
                    />
                    <SaveBoundarySaveButton disabled={false}>
                        <FormattedMessage id="common.assignSelection" defaultMessage="Assign selection" />
                    </SaveBoundarySaveButton>
                </DialogActions>
            </Dialog>
        </SaveBoundary>
    );
};
