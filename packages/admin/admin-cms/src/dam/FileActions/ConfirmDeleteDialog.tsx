import { CancelButton } from "@comet/admin";
import { Delete } from "@comet/admin-icons";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import React from "react";
import { FormattedMessage } from "react-intl";

import * as sc from "./ConfirmDeleteDialog.sc";

interface ConfirmDeleteDialogProps {
    open: boolean;
    closeDialog: (ok: boolean) => void;
    assetType: "file" | "folder";
    onDeleteButtonClick: () => void;
    name: string;
}

export const ConfirmDeleteDialog = ({ open, closeDialog, name, assetType, onDeleteButtonClick }: ConfirmDeleteDialogProps): React.ReactElement => {
    return (
        <Dialog open={open} onClose={() => closeDialog(false)}>
            <DialogTitle>
                <FormattedMessage id="dam.delete.confirmDeleting" defaultMessage="Confirm deleting" />
            </DialogTitle>
            <sc.ConfirmDialogContent>
                {/* @TODO: Only show warning if there are dependencies */}
                <sc.WarningWrapper>
                    <sc.WarningIcon />
                    <sc.WarningTextWrapper>
                        <sc.WarningHeading>
                            <FormattedMessage id="comet.generic.warning" defaultMessage="Warning" />
                        </sc.WarningHeading>
                        <sc.WarningText>
                            {assetType === "file" ? (
                                <FormattedMessage
                                    id="dam.delete.file.mightHaveDependenciesWarning"
                                    defaultMessage="The file {name} might be used somewhere on the website. If you delete this file now, it will disappear from all pages."
                                    values={{ name: name }}
                                />
                            ) : (
                                <FormattedMessage
                                    id="dam.delete.folder.mightHaveDependenciesWarning"
                                    defaultMessage="If you delete the folder {name}, all files inside this folder are irrevocably removed. Those files might be used somewhere on the website. If you delete them now, they will disappear from all pages."
                                    values={{ name: name }}
                                />
                            )}
                        </sc.WarningText>
                    </sc.WarningTextWrapper>
                </sc.WarningWrapper>
                <strong>
                    {assetType === "file" ? (
                        <FormattedMessage id="dam.delete.file.areYouSure" defaultMessage="Are you really sure you want to delete this file?" />
                    ) : (
                        <FormattedMessage id="dam.delete.folder.areYouSure" defaultMessage="Are you really sure you want to delete this folder?" />
                    )}
                </strong>
            </sc.ConfirmDialogContent>
            <DialogActions>
                <CancelButton onClick={() => closeDialog(false)} />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={async () => {
                        await onDeleteButtonClick();
                        closeDialog(true);
                    }}
                    autoFocus={true}
                    startIcon={<Delete />}
                >
                    <FormattedMessage id="dam.delete.deleteNow" defaultMessage="Delete Now" />
                </Button>
            </DialogActions>
        </Dialog>
    );
};
