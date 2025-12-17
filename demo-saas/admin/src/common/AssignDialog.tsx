import { useApolloClient } from "@apollo/client";
import { CancelButton, Dialog, SaveBoundary, SaveBoundarySaveButton } from "@comet/admin";
import { DialogActions, DialogContent } from "@mui/material";
import { type PropsWithChildren, type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

type Props = {
    onDialogClose: () => void;
    open: boolean;
    apolloCacheName?: string;
    title?: ReactNode;
};

export const AssignDialog = ({ onDialogClose, open, apolloCacheName, children, title }: PropsWithChildren<Props>) => {
    const client = useApolloClient();

    return (
        <SaveBoundary
            onAfterSave={() => {
                onDialogClose();
                if (apolloCacheName) {
                    client.cache.evict({ fieldName: apolloCacheName });
                }
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
