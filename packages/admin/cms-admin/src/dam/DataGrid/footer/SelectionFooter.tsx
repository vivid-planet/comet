import { gql, useApolloClient } from "@apollo/client";
import { Archive, Delete, Error as ErrorIcon, Move, Restore, ThreeDotSaving } from "@comet/admin-icons";
import { IconButton as CometAdminIconButton, Tooltip, Typography } from "@mui/material";
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
} from "../../../graphql.generated";
import { ConfirmDeleteDialog } from "../../FileActions/ConfirmDeleteDialog";
import { clearDamItemCache } from "../../helpers/clearDamItemCache";
import { DamItemSelectionMap } from "../FolderDataGrid";
import { DamFooter } from "./DamFooter";

const ButtonGroup = styled("div")`
    display: flex;
    gap: 10px;
`;

const StyledErrorIcon = styled(ErrorIcon)`
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
            clearDamItemCache(apolloClient.cache);
        }

        setDeleting(false);
    };

    const archiveSelected = async () => {
        if (selectedItemsMap === undefined) {
            return;
        }

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

        return { errors };
    };

    const restoreSelected = async () => {
        if (selectedItemsMap === undefined) {
            return;
        }

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

        return { errors };
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
                    <FooterActionButton
                        title={<FormattedMessage id="comet.dam.footer.move" defaultMessage="Move" />}
                        onClick={() => {
                            onOpenMoveDialog();
                        }}
                        icon={<Move />}
                    />
                    <FooterActionButton
                        title={<FormattedMessage id="comet.dam.footer.archive" defaultMessage="Archive" />}
                        executeMutation={archiveSelected}
                        icon={<Archive />}
                    />
                    <FooterActionButton
                        title={<FormattedMessage id="comet.dam.footer.restore" defaultMessage="Restore" />}
                        executeMutation={restoreSelected}
                        icon={<Restore />}
                    />
                    <FooterActionButton
                        title={<FormattedMessage id="comet.dam.footer.delete" defaultMessage="Delete" />}
                        onClick={() => {
                            setDeleteDialogOpen(true);
                        }}
                        icon={<Delete />}
                        loading={deleting}
                        hasErrors={hasDeletionErrors}
                    />
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

const StyledCometAdminIconButton = styled(CometAdminIconButton)`
    color: ${({ theme }) => theme.palette.grey.A100};
    padding-left: 4px;
    padding-right: 4px;
`;

interface IconButtonProps {
    title: NonNullable<React.ReactNode>;
    onClick?: () => void;
    executeMutation?: () => Promise<{ errors: readonly GraphQLError[] | undefined } | undefined>;
    icon: React.ReactNode;
    loading?: boolean;
    hasErrors?: boolean;
}

const FooterActionButton = ({ title, onClick, executeMutation, icon, loading: externalLoading, hasErrors: externalHasErrors }: IconButtonProps) => {
    const apolloClient = useApolloClient();

    const [internalLoading, setInternalLoading] = React.useState<boolean>(false);
    const [internalHasErrors, setInternalHasErrors] = React.useState<boolean>(false);

    const loading = externalLoading ?? internalLoading;
    const hasErrors = externalHasErrors ?? internalHasErrors;

    const handleClick = async () => {
        if (executeMutation === undefined) {
            throw new Error("FooterActionButton: You must either set onClick or executeMutation");
        }

        setInternalLoading(true);

        const result = await executeMutation();

        if (result) {
            if (result.errors) {
                setInternalHasErrors(true);
                setTimeout(() => {
                    setInternalHasErrors(false);
                }, 3000);
            } else {
                clearDamItemCache(apolloClient.cache);
            }
        }

        setInternalLoading(false);
    };

    return (
        <Tooltip title={title}>
            <StyledCometAdminIconButton onClick={onClick ?? handleClick} size="large">
                {loading ? <ThreeDotSaving /> : hasErrors ? <StyledErrorIcon /> : icon}
            </StyledCometAdminIconButton>
        </Tooltip>
    );
};
