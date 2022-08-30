import { gql, useApolloClient } from "@apollo/client";
import { Archive, Delete, Restore, ThreeDotSaving } from "@comet/admin-icons";
import { Checkbox, FormControlLabel, Grid, IconButton, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import {
    GQLArchiveFileMutation,
    GQLArchiveFileMutationVariables,
    GQLDamFileTableFragment,
    GQLDamFolderTableFragment,
    GQLDeleteDamFileMutation,
    GQLDeleteDamFileMutationVariables,
    GQLDeleteDamFolderMutation,
    GQLDeleteDamFolderMutationVariables,
    GQLRestoreFileMutation,
    GQLRestoreFileMutationVariables,
    namedOperations,
} from "../../../graphql.generated";
import { Separator } from "../../../pages/pagesPage/PagesPageActionToolbar.sc";
import { ConfirmDeleteDialog } from "../../FileActions/ConfirmDeleteDialog";
import { useDamMultiselectApi } from "../multiselect/DamMultiselect";
import { archiveDamFileMutation, deleteDamFileMutation, restoreDamFileMutation } from "./DamActions.gql";

const GridContainer = styled(Grid)`
    padding: 2px 29px;
`;

interface DamActionsProps {
    files: GQLDamFileTableFragment[];
    folders: GQLDamFolderTableFragment[];
}

export const DamActions: React.VoidFunctionComponent<DamActionsProps> = ({ files, folders }) => {
    const client = useApolloClient();
    const damMultiselectApi = useDamMultiselectApi();

    const [archiveLoading, setArchiveLoading] = React.useState<boolean>(false);
    const [restoreLoading, setRestoreLoading] = React.useState<boolean>(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = React.useState(false);

    const onSelectAllPressed = () => {
        if (damMultiselectApi.selectedState === "all_selected") {
            damMultiselectApi.unselectAll();
        } else {
            for (const file of files) {
                damMultiselectApi.select({ id: file.id, type: "file" });
            }

            for (const folder of folders) {
                damMultiselectApi.select({ id: folder.id, type: "folder" });
            }
        }
    };

    const archiveSelected = async () => {
        setArchiveLoading(true);

        for (const selectedItem of damMultiselectApi.selectedItems) {
            if (selectedItem.type === "file") {
                await client.mutate<GQLArchiveFileMutation, GQLArchiveFileMutationVariables>({
                    mutation: archiveDamFileMutation,
                    variables: { id: selectedItem.id },
                });
            }
        }

        await client.refetchQueries({ include: [namedOperations.Query.DamList] });
        damMultiselectApi.unselectAll();
        setArchiveLoading(false);
    };

    const restoreSelected = async () => {
        setRestoreLoading(true);

        for (const selectedItem of damMultiselectApi.selectedItems) {
            if (selectedItem.type === "file") {
                await client.mutate<GQLRestoreFileMutation, GQLRestoreFileMutationVariables>({
                    mutation: restoreDamFileMutation,
                    variables: { id: selectedItem.id },
                });
            }
        }

        await client.refetchQueries({ include: [namedOperations.Query.DamList] });
        damMultiselectApi.unselectAll();
        setRestoreLoading(false);
    };

    const deleteSelected = async () => {
        setDeleteLoading(true);
        for (const selectedItem of damMultiselectApi.selectedItems) {
            if (selectedItem.type === "file") {
                await client.mutate<GQLDeleteDamFileMutation, GQLDeleteDamFileMutationVariables>({
                    mutation: deleteDamFileMutation,
                    variables: { id: selectedItem.id },
                });
            } else {
                await client.mutate<GQLDeleteDamFolderMutation, GQLDeleteDamFolderMutationVariables>({
                    mutation: gql`
                        mutation DeleteDamFolder($id: ID!) {
                            deleteSuccessful: deleteDamFolder(id: $id)
                        }
                    `,
                    variables: { id: selectedItem.id },
                });
            }
        }

        await client.refetchQueries({ include: [namedOperations.Query.DamItemsList] });
        damMultiselectApi.unselectAll();
        setDeleteLoading(false);
    };

    return (
        <>
            <GridContainer container justifyContent="space-between" alignItems="center">
                <Grid item>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={damMultiselectApi.selectedState === "all_selected"}
                                indeterminate={damMultiselectApi.selectedState === "some_selected"}
                                onChange={onSelectAllPressed}
                            />
                        }
                        label={<FormattedMessage id="comet.dam.actions.selectAll" defaultMessage="Select all" />}
                    />
                </Grid>
                <Grid item display="flex" alignItems="center">
                    <Tooltip title={<FormattedMessage id="comet.dam.actions.tooltip.restore" defaultMessage="Restore" />}>
                        <span>
                            <IconButton
                                disabled={damMultiselectApi.selectedItems.length === 0}
                                onClick={async () => {
                                    await restoreSelected();
                                }}
                                size="large"
                            >
                                {restoreLoading ? <ThreeDotSaving /> : <Restore />}
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title={<FormattedMessage id="comet.pagesPageActionToolbar.tooltip.archive" defaultMessage="Archive" />}>
                        <span>
                            <IconButton
                                disabled={damMultiselectApi.selectedItems.length === 0}
                                onClick={async () => {
                                    await archiveSelected();
                                }}
                                size="large"
                            >
                                {archiveLoading ? <ThreeDotSaving /> : <Archive />}
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Separator />
                    <Tooltip title={<FormattedMessage id="comet.dam.actions.tooltip.delete" defaultMessage="Delete" />}>
                        <span>
                            <IconButton
                                disabled={damMultiselectApi.selectedItems.length === 0}
                                onClick={() => {
                                    setDeleteDialogOpen(true);
                                }}
                            >
                                {deleteLoading ? <ThreeDotSaving /> : <Delete />}
                            </IconButton>
                        </span>
                    </Tooltip>
                </Grid>
                <Grid item />
            </GridContainer>
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
