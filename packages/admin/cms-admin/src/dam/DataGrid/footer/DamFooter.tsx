import { gql, useApolloClient } from "@apollo/client";
import { SaveButton } from "@comet/admin";
import { Delete, Move, Upload } from "@comet/admin-icons";
import { Button, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { GraphQLError } from "graphql";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

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

const FooterBar = styled(Paper)`
    position: fixed;
    z-index: 10;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);

    min-width: 1280px;
    min-height: 60px;
    border-radius: 4px;

    background-color: ${({ theme }) => theme.palette.primary.dark};
    color: ${({ theme }) => theme.palette.primary.contrastText};

    display: flex;
    justify-content: center;
    align-items: center;
`;

const UploadIcon = styled(Upload)`
    font-size: 18px;
    margin-right: 13px;
`;

const AlignTextAndImage = styled(Typography)`
    display: flex;
    align-items: center;
`;

const ButtonGroup = styled("div")`
    display: flex;
    gap: 10px;
`;

interface DamFooterProps {
    open: boolean;
    type?: "selection" | "upload";
    folderName?: string;
    selectedItemsMap?: DamItemSelectionMap;
    onOpenMoveDialog: () => void;
}

export const DamFooter: React.VoidFunctionComponent<DamFooterProps> = ({ open, type, folderName, selectedItemsMap, onOpenMoveDialog }) => {
    const intl = useIntl();
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
            <FooterBar>
                <AlignTextAndImage>
                    {type === "upload" && (
                        <>
                            <UploadIcon />
                            <FormattedMessage
                                id="comet.dam.footer.dropFilesHereToUpload"
                                defaultMessage="Drop files here to upload them to the folder: <strong>{folderName}</strong>"
                                values={{
                                    strong: (chunks: string) => (
                                        <strong>
                                            {/*Otherwise there is no whitespace between other text and strong*/}
                                            &nbsp;
                                            {chunks}
                                        </strong>
                                    ),
                                    folderName:
                                        folderName ||
                                        intl.formatMessage({
                                            id: "comet.dam.footer.assetManager",
                                            defaultMessage: "Asset Manager",
                                        }),
                                }}
                            />
                        </>
                    )}

                    {type === "selection" && (
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
                            <Button
                                color="secondary"
                                variant="contained"
                                startIcon={<Move />}
                                onClick={() => {
                                    onOpenMoveDialog();
                                }}
                            >
                                <FormattedMessage
                                    id="comet.dam.footer.move"
                                    defaultMessage="Move {num, plural, one {one item} other {# items}}"
                                    values={{
                                        num: selectedItemsMap?.size,
                                    }}
                                />
                            </Button>
                        </ButtonGroup>
                    )}
                </AlignTextAndImage>
            </FooterBar>
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
