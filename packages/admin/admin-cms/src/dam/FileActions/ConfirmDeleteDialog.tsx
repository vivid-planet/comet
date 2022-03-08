import { useApolloClient } from "@apollo/client";
import { CancelButton } from "@comet/admin";
import { Delete } from "@comet/admin-icons";
import { Button, Dialog, DialogActions, DialogTitle } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

import { GQLDamFile, GQLDeleteDamFileMutation, GQLDeleteDamFileMutationVariables, namedOperations } from "../../graphql.generated";
import { deleteDamFileMutation } from "./ConfirmDeleteDialog.gql";
import * as sc from "./ConfirmDeleteDialog.sc";

interface ConfirmDeleteDialogProps {
    open: boolean;
    closeDialog: (ok: boolean) => void;
    file: Pick<GQLDamFile, "id" | "name">;
}

export const ConfirmDeleteDialog = ({ open, closeDialog, file }: ConfirmDeleteDialogProps): React.ReactElement => {
    const client = useApolloClient();

    return (
        <Dialog open={open} onClose={() => closeDialog(false)}>
            <DialogTitle>
                <FormattedMessage id="dam.file.delete.confirmDeleting" defaultMessage="Confirm deleting" />
            </DialogTitle>
            <sc.ConfirmDialogContent>
                {/* @TODO: Only show warning if the file has dependencies */}
                <sc.WarningWrapper>
                    <sc.WarningIcon />
                    <sc.WarningTextWrapper>
                        <sc.WarningHeading>
                            <FormattedMessage id="comet.generic.warning" defaultMessage="Warning" />
                        </sc.WarningHeading>
                        <sc.WarningText>
                            {/*@TODO: once dependencies are implemented:*/}
                            {/*<FormattedMessage*/}
                            {/*    id="dam.file.delete.hasDependenciesWarning"*/}
                            {/*    defaultMessage="The file {fileName} has several dependencies within your website. If you delete the file now, all dependencies will be*/}
                            {/*irrevocably removed."*/}
                            {/*    values={{ fileName: file.name }}*/}
                            {/*/>*/}
                            <FormattedMessage
                                id="dam.file.delete.mightHaveDependenciesWarning"
                                defaultMessage="The file {fileName} might have dependencies within your website. If you delete the file now, all dependencies will be
                            irrevocably removed."
                                values={{ fileName: file.name }}
                            />
                        </sc.WarningText>
                    </sc.WarningTextWrapper>
                </sc.WarningWrapper>
                <strong>
                    <FormattedMessage id="dam.file.delete.areYouSure" defaultMessage="Are you really sure you want to delete this file?" />
                </strong>
            </sc.ConfirmDialogContent>
            <DialogActions>
                <CancelButton onClick={() => closeDialog(false)} />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={async () => {
                        await client.mutate<GQLDeleteDamFileMutation, GQLDeleteDamFileMutationVariables>({
                            mutation: deleteDamFileMutation,
                            variables: { id: file.id },
                            refetchQueries: [namedOperations.Query.DamFilesList],
                        });
                        closeDialog(true);
                    }}
                    autoFocus={true}
                    startIcon={<Delete />}
                >
                    <FormattedMessage id="dam.file.delete.deleteNow" defaultMessage="Delete Now" />
                </Button>
            </DialogActions>
        </Dialog>
    );
};
