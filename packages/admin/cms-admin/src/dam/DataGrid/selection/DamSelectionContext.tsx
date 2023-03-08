import { gql, useApolloClient } from "@apollo/client";
import { FetchResult } from "@apollo/client/link/core";
import { GraphQLError } from "graphql";
import React from "react";

import {
    GQLArchiveFilesMutation,
    GQLArchiveFilesMutationVariables,
    GQLDeleteDamFileMutation,
    GQLDeleteDamFileMutationVariables,
    GQLDeleteDamFolderMutation,
    GQLDeleteDamFolderMutationVariables,
    GQLMoveDamFilesMutation,
    GQLMoveDamFilesMutationVariables,
    GQLMoveDamFoldersMutation,
    GQLMoveDamFoldersMutationVariables,
    GQLRestoreFilesMutation,
    GQLRestoreFilesMutationVariables,
} from "../../../graphql.generated";
import { ConfirmDeleteDialog } from "../../FileActions/ConfirmDeleteDialog";
import { clearDamItemCache } from "../../helpers/clearDamItemCache";
import { MoveDamItemDialog } from "../../MoveDamItemDialog/MoveDamItemDialog";
import { DamItemSelectionMap } from "../FolderDataGrid";
import { moveDamFilesMutation, moveDamFoldersMutation } from "../FolderDataGrid.gql";

interface DamSelectionApi {
    selectionMap: DamItemSelectionMap;
    setSelectionMap: React.Dispatch<React.SetStateAction<DamItemSelectionMap>>;

    // delete
    deleteSelected: () => void;
    deleting: boolean;
    hasDeletionErrors: boolean;

    // restore
    restoreSelected: () => void;
    restoring: boolean;
    hasRestoreErrors: boolean;

    // archive
    archiveSelected: () => void;
    archiving: boolean;
    hasArchiveErrors: boolean;

    // move
    moveSelected: () => void;
    moving: boolean;
    hasMoveErrors: boolean;
}

export const DamSelectionContext = React.createContext<DamSelectionApi>({
    selectionMap: new Map(),
    setSelectionMap: () => {
        throw new Error("Missing DamSelectionContext. Please add a <DamSelectionProvider /> somewhere up in the tree.");
    },

    deleteSelected: () => {
        throw new Error("Missing DamSelectionContext. Please add a <DamSelectionProvider /> somewhere up in the tree.");
    },
    deleting: false,
    hasDeletionErrors: false,

    restoreSelected: () => {
        throw new Error("Missing DamSelectionContext. Please add a <DamSelectionProvider /> somewhere up in the tree.");
    },
    restoring: false,
    hasRestoreErrors: false,

    archiveSelected: () => {
        throw new Error("Missing DamSelectionContext. Please add a <DamSelectionProvider /> somewhere up in the tree.");
    },
    archiving: false,
    hasArchiveErrors: false,

    moveSelected: () => {
        throw new Error("Missing DamSelectionContext. Please add a <DamSelectionProvider /> somewhere up in the tree.");
    },
    moving: false,
    hasMoveErrors: false,
});

export const useDamSelectionApi = () => {
    return React.useContext(DamSelectionContext);
};

export const DamSelectionProvider: React.FunctionComponent = ({ children }) => {
    const apolloClient = useApolloClient();
    const [selectionMap, setSelectionMap] = React.useState<DamItemSelectionMap>(new Map());

    const showError = (setError: React.Dispatch<React.SetStateAction<boolean>>) => {
        setError(true);
        setTimeout(() => {
            setError(false);
        }, 3000);
    };

    // delete
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState<boolean>(false);
    const [deleting, setDeleting] = React.useState(false);
    const [hasDeletionErrors, setHasDeletionErrors] = React.useState(false);

    const openDeleteDialog = React.useCallback(() => {
        setDeleteDialogOpen(true);
    }, []);

    const deleteSelected = React.useCallback(async () => {
        setDeleting(true);

        const selectedItems = Array.from(selectionMap.entries()).map((item) => {
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
            showError(setHasDeletionErrors);
        } else {
            clearDamItemCache(apolloClient.cache);
        }

        setDeleting(false);
    }, [apolloClient, selectionMap]);

    // restore
    const [restoring, setRestoring] = React.useState(false);
    const [hasRestoreErrors, setHasRestoreErrors] = React.useState(false);

    const restoreSelected = React.useCallback(async () => {
        setRestoring(true);

        const fileIds = Array.from(selectionMap.entries())
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
            showError(setHasRestoreErrors);
        } else {
            clearDamItemCache(apolloClient.cache);
        }

        setRestoring(false);
    }, [apolloClient, selectionMap]);

    // archive
    const [archiving, setArchiving] = React.useState(false);
    const [hasArchiveErrors, setHasArchiveErrors] = React.useState(false);

    const archiveSelected = React.useCallback(async () => {
        setArchiving(true);

        const fileIds = Array.from(selectionMap.entries())
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
            showError(setHasArchiveErrors);
        } else {
            clearDamItemCache(apolloClient.cache);
        }

        setArchiving(false);
    }, [apolloClient, selectionMap]);

    // move
    const [moveDialogOpen, setMoveDialogOpen] = React.useState(false);
    const [moving, setMoving] = React.useState(false);
    const [hasMoveErrors, setHasMoveErrors] = React.useState(false);

    const openMoveDialog = React.useCallback(() => {
        setMoveDialogOpen(true);
    }, []);

    const moveSelected = React.useCallback(
        async (targetFolderId: string | null) => {
            setMoving(true);

            const damItemsToMove = Array.from(selectionMap, ([id, type]) => {
                return { id, type };
            });

            const fileIds = damItemsToMove.filter((item) => item.type === "file").map((item) => item.id);
            const folderIds = damItemsToMove.filter((item) => item.type === "folder").map((item) => item.id);

            const mutations: Array<Promise<FetchResult>> = [];

            if (fileIds.length > 0) {
                mutations.push(
                    apolloClient.mutate<GQLMoveDamFilesMutation, GQLMoveDamFilesMutationVariables>({
                        mutation: moveDamFilesMutation,
                        variables: {
                            fileIds,
                            targetFolderId: targetFolderId,
                        },
                        errorPolicy: "all",
                    }),
                );
            }

            if (folderIds.length > 0) {
                mutations.push(
                    apolloClient.mutate<GQLMoveDamFoldersMutation, GQLMoveDamFoldersMutationVariables>({
                        mutation: moveDamFoldersMutation,
                        variables: {
                            folderIds,
                            targetFolderId: targetFolderId,
                        },
                        errorPolicy: "all",
                    }),
                );
            }

            const promiseResults = await Promise.all(mutations);
            const hasError = promiseResults.filter((result) => result.errors !== undefined).length > 0;

            if (hasError) {
                showError(setHasMoveErrors);
            } else {
                clearDamItemCache(apolloClient.cache);
            }

            setMoving(false);
        },
        [apolloClient, selectionMap],
    );

    return (
        <DamSelectionContext.Provider
            value={{
                selectionMap,
                setSelectionMap,

                deleteSelected: openDeleteDialog,
                deleting,
                hasDeletionErrors,

                restoreSelected,
                restoring,
                hasRestoreErrors,

                archiveSelected,
                archiving,
                hasArchiveErrors,

                moveSelected: openMoveDialog,
                moving,
                hasMoveErrors,
            }}
        >
            {children}
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
            <MoveDamItemDialog
                open={moveDialogOpen}
                onClose={() => {
                    setMoveDialogOpen(false);
                }}
                onChooseFolder={async (folderId) => {
                    await moveSelected(folderId);
                    setMoveDialogOpen(false);
                }}
                numberOfItems={selectionMap.size}
                moving={moving}
                hasErrors={hasMoveErrors}
            />
        </DamSelectionContext.Provider>
    );
};
