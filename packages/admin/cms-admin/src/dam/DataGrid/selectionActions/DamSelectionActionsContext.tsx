import { gql, useApolloClient } from "@apollo/client";
import { GraphQLError } from "graphql";
import React from "react";

import {
    GQLArchiveFilesMutation,
    GQLArchiveFilesMutationVariables,
    GQLDeleteDamFileMutation,
    GQLDeleteDamFileMutationVariables,
    GQLDeleteDamFolderMutation,
    GQLDeleteDamFolderMutationVariables,
    GQLRestoreFilesMutation,
    GQLRestoreFilesMutationVariables,
} from "../../../graphql.generated";
import { ConfirmDeleteDialog } from "../../FileActions/ConfirmDeleteDialog";
import { clearDamItemCache } from "../../helpers/clearDamItemCache";
import { DamItemSelectionMap } from "../FolderDataGrid";

interface DamSelectionActionsApi {
    // delete
    deleteSelected: (selectionMap: DamItemSelectionMap) => void;
    deleting: boolean;
    hasDeletionErrors: boolean;

    // restore
    restoreSelected: (selectionMap: DamItemSelectionMap) => void;
    restoring: boolean;
    hasRestoreErrors: boolean;

    // archive
    archiveSelected: (selectionMap: DamItemSelectionMap) => void;
    archiving: boolean;
    hasArchiveErrors: boolean;
}

export const DamSelectionActionsContext = React.createContext<DamSelectionActionsApi>({
    deleteSelected: () => {
        throw new Error("Missing DamSelectionActionsContext. Please add a <DamSelectionActionsProvider /> somewhere up in the tree.");
    },
    deleting: false,
    hasDeletionErrors: false,

    restoreSelected: () => {
        throw new Error("Missing DamSelectionActionsContext. Please add a <DamSelectionActionsProvider /> somewhere up in the tree.");
    },
    restoring: false,
    hasRestoreErrors: false,

    archiveSelected: () => {
        throw new Error("Missing DamSelectionActionsContext. Please add a <DamSelectionActionsProvider /> somewhere up in the tree.");
    },
    archiving: false,
    hasArchiveErrors: false,
});

export const useDamSelectionActionsApi = () => {
    return React.useContext(DamSelectionActionsContext);
};

export const DamSelectionActionsProvider: React.FunctionComponent = ({ children }) => {
    const apolloClient = useApolloClient();

    // delete
    const [deleteSelectionMap, setDeleteSelectionMap] = React.useState<DamItemSelectionMap>();
    const deleteDialogOpen = deleteSelectionMap !== undefined;
    const [deleting, setDeleting] = React.useState(false);
    const [hasDeletionErrors, setHasDeletionErrors] = React.useState(false);

    const openDeleteDialog = (selectionMap: DamItemSelectionMap | undefined) => {
        setDeleteSelectionMap(selectionMap);
    };
    const closeDeleteDialog = () => {
        setDeleteSelectionMap(undefined);
    };

    const deleteSelected = React.useCallback(async () => {
        if (deleteSelectionMap === undefined) {
            return;
        }

        setDeleting(true);

        const selectedItems = Array.from(deleteSelectionMap.entries()).map((item) => {
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
                    errorPolicy: "all",
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
                    errorPolicy: "all",
                });

                errors = result.errors;
            }
        }

        if (errors) {
            setHasDeletionErrors(true);
            setTimeout(() => {
                setHasDeletionErrors(false);
            }, 3000);
        } else {
            clearDamItemCache(apolloClient.cache);
        }

        setDeleting(false);
    }, [apolloClient, deleteSelectionMap]);

    // restore
    const [restoring, setRestoring] = React.useState(false);
    const [hasRestoreErrors, setHasRestoreErrors] = React.useState(false);

    const restoreSelected = React.useCallback(
        async (selectedItemsMap: DamItemSelectionMap) => {
            setRestoring(true);

            const fileIds = Array.from(selectedItemsMap.entries())
                .filter(([, type]) => type === "file")
                .map(([id]) => {
                    return id;
                });

            const { errors } = await apolloClient.mutate<GQLRestoreFilesMutation, GQLRestoreFilesMutationVariables>({
                mutation: gql`
                    mutation RestoreFiles($ids: [ID!]!) {
                        restoreDamFiles(ids: $ids) {
                            id
                            archived
                        }
                    }
                `,
                variables: {
                    ids: fileIds,
                },
                errorPolicy: "all",
            });

            if (errors) {
                setHasRestoreErrors(true);
                setTimeout(() => {
                    setHasRestoreErrors(false);
                }, 3000);
            } else {
                clearDamItemCache(apolloClient.cache);
            }

            setRestoring(false);
        },
        [apolloClient],
    );

    // archive
    const [archiving, setArchiving] = React.useState(false);
    const [hasArchiveErrors, setHasArchiveErrors] = React.useState(false);

    const archiveSelected = React.useCallback(
        async (selectedItemsMap: DamItemSelectionMap) => {
            setArchiving(true);

            const fileIds = Array.from(selectedItemsMap.entries())
                .filter(([, type]) => type === "file")
                .map(([id]) => {
                    return id;
                });

            const { errors } = await apolloClient.mutate<GQLArchiveFilesMutation, GQLArchiveFilesMutationVariables>({
                mutation: gql`
                    mutation ArchiveFiles($ids: [ID!]!) {
                        archiveDamFiles(ids: $ids) {
                            id
                            archived
                        }
                    }
                `,
                variables: {
                    ids: fileIds,
                },
                errorPolicy: "all",
            });

            if (errors) {
                setHasArchiveErrors(true);
                setTimeout(() => {
                    setHasArchiveErrors(false);
                }, 3000);
            } else {
                clearDamItemCache(apolloClient.cache);
            }

            setArchiving(false);
        },
        [apolloClient],
    );

    return (
        <DamSelectionActionsContext.Provider
            value={{
                deleteSelected: openDeleteDialog,
                deleting,
                hasDeletionErrors,

                restoreSelected,
                restoring,
                hasRestoreErrors,

                archiveSelected,
                archiving,
                hasArchiveErrors,
            }}
        >
            {children}
            <ConfirmDeleteDialog
                open={deleteDialogOpen}
                onCloseDialog={async (confirmed) => {
                    if (confirmed) {
                        await deleteSelected();
                    }
                    closeDeleteDialog();
                }}
                itemType="selected_items"
            />
        </DamSelectionActionsContext.Provider>
    );
};
