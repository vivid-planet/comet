import { gql, useApolloClient } from "@apollo/client";
import { Archive, Delete, Error, Move, Restore, ThreeDotSaving } from "@comet/admin-icons";
import { IconButton, Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { GraphQLError } from "graphql";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import {
    GQLArchiveFilesMutation,
    GQLArchiveFilesMutationVariables,
    GQLDeleteDamFileMutation,
    GQLDeleteDamFileMutationVariables,
    GQLDeleteDamFolderMutation,
    GQLDeleteDamFolderMutationVariables,
    GQLRestoreFilesMutation,
    GQLRestoreFilesMutationVariables,
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

const ErrorIcon = styled(Error)`
    color: ${({ theme }) => theme.palette.error.main};
`;

interface DamSelectionFooterProps {
    open: boolean;
    selectedItemsMap?: DamItemSelectionMap;
    onOpenMoveDialog: () => void;
}

export const DamSelectionFooter: React.VoidFunctionComponent<DamSelectionFooterProps> = ({ open, selectedItemsMap, onOpenMoveDialog }) => {
    const apolloClient = useApolloClient();

    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState<boolean>(false);
    const [deleting, setDeleting] = React.useState(false);
    const [hasDeletionErrors, setHasDeletionErrors] = React.useState(false);

    const [archiving, setArchiving] = React.useState<boolean>(false);
    const [hasArchivingErrors, setHasArchivingErrors] = React.useState(false);

    const [restoring, setRestoring] = React.useState<boolean>(false);
    const [hasRestoringErrors, setHasRestoringErrors] = React.useState(false);

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
            await apolloClient.refetchQueries({ include: [namedOperations.Query.DamItemsList] });
            clearDamItemCache(apolloClient.cache);
        }

        setDeleting(false);
    };

    const archiveSelected = async () => {
        if (selectedItemsMap === undefined) {
            return;
        }

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
            setHasArchivingErrors(true);
            setTimeout(() => {
                setHasArchivingErrors(false);
            }, 3000);
        } else {
            await apolloClient.refetchQueries({ include: [namedOperations.Query.DamItemsList] });
            clearDamItemCache(apolloClient.cache);
        }

        setArchiving(false);
    };

    const restoreSelected = async () => {
        if (selectedItemsMap === undefined) {
            return;
        }

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
            setHasRestoringErrors(true);
            setTimeout(() => {
                setHasRestoringErrors(false);
            }, 3000);
        } else {
            await apolloClient.refetchQueries({ include: [namedOperations.Query.DamItemsList] });
            clearDamItemCache(apolloClient.cache);
        }

        setRestoring(false);
    };

    if (!open) {
        return null;
    }

    return (
        <>
            <DamFooter open={open}>
                <Typography>
                    <FormattedMessage
                        id="comet.dam.footer.selected"
                        defaultMessage="{count, plural, one {# item} other {# items}} selected"
                        values={{
                            count: selectedItemsMap?.size,
                        }}
                    />
                </Typography>
                <ButtonGroup>
                    <Tooltip title={<FormattedMessage id="comet.dam.footer.move" defaultMessage="Move" />}>
                        <IconButton
                            onClick={() => {
                                onOpenMoveDialog();
                            }}
                            size="large"
                            sx={{
                                color: (theme) => theme.palette.grey.A100,
                                paddingLeft: "4px",
                                paddingRight: "4px",
                            }}
                        >
                            <Move />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={<FormattedMessage id="comet.dam.footer.archive" defaultMessage="Archive" />}>
                        <IconButton
                            onClick={() => {
                                archiveSelected();
                            }}
                            size="large"
                            sx={{
                                color: (theme) => theme.palette.grey.A100,
                                paddingLeft: "4px",
                                paddingRight: "4px",
                            }}
                        >
                            {archiving ? <ThreeDotSaving /> : hasArchivingErrors ? <ErrorIcon /> : <Archive />}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={<FormattedMessage id="comet.dam.footer.restore" defaultMessage="Restore" />}>
                        <IconButton
                            onClick={() => {
                                restoreSelected();
                            }}
                            size="large"
                            sx={{
                                color: (theme) => theme.palette.grey.A100,
                                paddingLeft: "4px",
                                paddingRight: "4px",
                            }}
                        >
                            {restoring ? <ThreeDotSaving /> : hasRestoringErrors ? <ErrorIcon /> : <Restore />}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={<FormattedMessage id="comet.dam.footer.delete" defaultMessage="Delete" />}>
                        <IconButton
                            onClick={() => {
                                setDeleteDialogOpen(true);
                            }}
                            size="large"
                            sx={{
                                color: (theme) => theme.palette.grey.A100,
                                paddingLeft: "4px",
                                paddingRight: "4px",
                            }}
                        >
                            {deleting ? <ThreeDotSaving /> : hasDeletionErrors ? <ErrorIcon /> : <Delete />}
                        </IconButton>
                    </Tooltip>
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
