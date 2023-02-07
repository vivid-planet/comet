import { gql, useApolloClient } from "@apollo/client";
import { SaveButton } from "@comet/admin";
import { Delete, Move } from "@comet/admin-icons";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { GraphQLError } from "graphql";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import {
    GQLDeleteDamFileMutation,
    GQLDeleteDamFileMutationVariables,
    GQLDeleteDamFolderMutation,
    GQLDeleteDamFolderMutationVariables,
    namedOperations,
} from "../../../graphql.generated";
import { ConfirmDeleteDialog } from "../../FileActions/ConfirmDeleteDialog";
import { clearDamItemCache } from "../../helpers/clearDamItemCache";
import { DamItemSelectionMap } from "../FolderDataGrid";
import { DamFooter } from "./DamFooter";

const ButtonGroup = styled("div")`
    display: flex;
    gap: 10px;
`;

interface DamSelectionFooterProps {
    open: boolean;
    selectedItemsMap?: DamItemSelectionMap;
}

export const DamSelectionFooter: React.VoidFunctionComponent<DamSelectionFooterProps> = ({ open, selectedItemsMap }) => {
    const apolloClient = useApolloClient();

    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState<boolean>(false);
    const [deleting, setDeleting] = React.useState(false);
    const [hasDeletionErrors, setHasDeletionErrors] = React.useState(false);

    const deleteSelected = async () => {
        if (selectedItemsMap === undefined) {
            return;
        }

        setDeleting(true);

        const selectedItems = Array.from(selectedItemsMap.entries()).map((item) => {
            return { id: item[0], type: item[1] };
        });

        let errors: readonly GraphQLError[] | undefined;
        for (const selectedItem of selectedItems) {
            if (selectedItem.type === "file") {
                const result = await apolloClient.mutate<GQLDeleteDamFileMutation, GQLDeleteDamFileMutationVariables>({
                    mutation: gql`
                        mutation DeleteDamFile($id: ID!) {
                            deleteDamFile(id: $id)
                        }
                    `,
                    variables: { id: selectedItem.id },
                });

                errors = result.errors;
            } else {
                const result = await apolloClient.mutate<GQLDeleteDamFolderMutation, GQLDeleteDamFolderMutationVariables>({
                    mutation: gql`
                        mutation DeleteDamFolder($id: ID!) {
                            deleteSuccessful: deleteDamFolder(id: $id)
                        }
                    `,
                    variables: { id: selectedItem.id },
                });

                errors = result.errors;
            }
        }

        if (errors) {
            setHasDeletionErrors(true);
            setTimeout(() => {
                setHasDeletionErrors(false);
            }, 2000);
        }

        await apolloClient.refetchQueries({ include: [namedOperations.Query.DamItemsList] });
        clearDamItemCache(apolloClient.cache);
        setDeleting(false);
    };

    if (!open) {
        return null;
    }

    return (
        <>
            <DamFooter open={open}>
                <ButtonGroup>
                    <SaveButton
                        saving={deleting}
                        hasErrors={hasDeletionErrors}
                        color="secondary"
                        onClick={() => {
                            setDeleteDialogOpen(true);
                        }}
                        saveIcon={<Delete />}
                        savingItem={<FormattedMessage id="comet.dam.footer.deleting" defaultMessage="Deleting" />}
                        successItem={<FormattedMessage id="comet.dam.footer.successfullyDeleted" defaultMessage="Successfully deleted" />}
                        errorItem={<FormattedMessage id="comet.dam.footer.errorWhileDeleting" defaultMessage="Error while deleting" />}
                    >
                        <FormattedMessage
                            id="comet.dam.footer.delete"
                            defaultMessage="Delete {num, plural, one {one item} other {# items}}"
                            values={{
                                num: selectedItemsMap?.size,
                            }}
                        />
                    </SaveButton>
                    <Button color="secondary" variant="contained" startIcon={<Move />}>
                        <FormattedMessage
                            id="comet.dam.footer.move"
                            defaultMessage="Move {num, plural, one {one item} other {# items}}"
                            values={{
                                num: selectedItemsMap?.size,
                            }}
                        />
                    </Button>
                </ButtonGroup>
            </DamFooter>
            <ConfirmDeleteDialog
                open={deleteDialogOpen}
                onCloseDialog={async (confirmed) => {
                    if (confirmed) {
                        await deleteSelected();
                    }
                    setDeleteDialogOpen(false);
                }}
                itemType="selected_items"
            />
        </>
    );
};
