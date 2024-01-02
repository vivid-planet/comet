import { gql, useApolloClient } from "@apollo/client";
import { saveAs } from "file-saver";
import { GraphQLError } from "graphql";
import React from "react";

import { useDamScope } from "../../config/useDamScope";
import { ConfirmDeleteDialog } from "../../FileActions/ConfirmDeleteDialog";
import { clearDamItemCache } from "../../helpers/clearDamItemCache";
import { MoveDamItemDialog } from "../../MoveDamItemDialog/MoveDamItemDialog";
import { useCopyPasteDamItems } from "../copyPaste/useCopyPasteDamItems";
import { DamItemSelectionMap } from "../FolderDataGrid";
import {
    GQLArchiveFilesMutation,
    GQLArchiveFilesMutationVariables,
    GQLDamFileDownloadInfoFragment,
    GQLDeleteDamFileMutation,
    GQLDeleteDamFileMutationVariables,
    GQLDeleteDamFolderMutation,
    GQLDeleteDamFolderMutationVariables,
    GQLRestoreFilesMutation,
    GQLRestoreFilesMutationVariables,
} from "./DamSelectionContext.generated";

export const damFileDownloadInfoFragment = gql`
    fragment DamFileDownloadInfo on DamFile {
        id
        fileUrl
        name
    }
`;

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

    // download
    downloadSelected: () => void;
    downloading: boolean;
    hasDownloadErrors: boolean;

    // copying
    copySelected: () => void;
    copying: boolean;
    hasCopyErrors: boolean;
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

    downloadSelected: () => {
        throw new Error("Missing DamSelectionContext. Please add a <DamSelectionProvider /> somewhere up in the tree.");
    },
    downloading: false,
    hasDownloadErrors: false,

    copySelected: () => {
        throw new Error("Missing DamSelectionContext. Please add a <DamSelectionProvider /> somewhere up in the tree.");
    },
    copying: false,
    hasCopyErrors: false,
});

export const useDamSelectionApi = () => {
    return React.useContext(DamSelectionContext);
};

export const DamSelectionProvider: React.FunctionComponent = ({ children }) => {
    const apolloClient = useApolloClient();
    const [selectionMap, setSelectionMap] = React.useState<DamItemSelectionMap>(new Map());
    const scope = useDamScope();
    const { prepareForClipboard, writeToClipboard } = useCopyPasteDamItems({ scope });

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

    // download
    const [downloading, setDownloading] = React.useState(false);
    const [hasDownloadErrors, setHasDownloadErrors] = React.useState(false);

    const downloadSelected = async () => {
        setDownloading(true);

        const fileIds = Array.from(selectionMap.entries())
            .filter(([, type]) => type === "file")
            .map(([id]) => {
                return id;
            });

        for (const id of fileIds) {
            const downloadInfo = apolloClient.cache.readFragment<GQLDamFileDownloadInfoFragment>({
                id: apolloClient.cache.identify({ __typename: "DamFile", id: id }),
                fragment: damFileDownloadInfoFragment,
            });

            if (downloadInfo === null) {
                showError(setHasDownloadErrors);
            } else {
                saveAs(downloadInfo.fileUrl, downloadInfo.name);
            }
        }

        setDownloading(false);
    };

    // copy
    const [copying, setCopying] = React.useState(false);
    const [hasCopyErrors, setHasCopyErrors] = React.useState(false);

    const copySelected = async () => {
        setCopying(true);

        const selectedItems = Array.from(selectionMap.entries()).map((item) => {
            return { id: item[0], type: item[1] };
        });

        try {
            await writeToClipboard(await prepareForClipboard(selectedItems));
        } catch (e) {
            showError(setHasCopyErrors);
        }

        setCopying(false);
    };

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

                downloadSelected,
                downloading,
                hasDownloadErrors,

                copySelected,
                copying,
                hasCopyErrors,
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
                damItemsToMove={Array.from(selectionMap.entries()).map((item) => {
                    return { id: item[0], type: item[1] };
                })}
                setMoving={setMoving}
                handleHasErrors={(hasErrors) => {
                    if (hasErrors) {
                        showError(setHasMoveErrors);
                    }
                }}
                open={moveDialogOpen}
                onClose={() => {
                    setMoveDialogOpen(false);
                }}
                moving={moving}
                hasErrors={hasMoveErrors}
            />
        </DamSelectionContext.Provider>
    );
};
