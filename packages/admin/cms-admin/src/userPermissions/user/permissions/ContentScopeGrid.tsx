import { gql, useApolloClient, useQuery } from "@apollo/client";
import { FieldSet } from "@comet/admin";
import { Card, IconButton } from "@mui/material";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import React from "react";
import { FormattedMessage } from "react-intl";

import { Delete, Filter } from "../../../../../admin-icons/lib";
import { camelCaseToHumanReadable } from "../../utils/camelCaseToHumanReadable";
import {
    GQLContentScopesQuery,
    GQLContentScopesQueryVariables,
    GQLUpdateContentScopesMutation,
    GQLUpdateContentScopesMutationVariables,
} from "./ContentScopeGrid.generated";
import { ContentScopeGridToolbar } from "./ContentScopeGridToolbar";
import { ContentScopeDialog } from "./ContentScopesDialog";

type GQLUserContentScopes = GQLContentScopesQuery["userContentScopes"];

export const ContentScopeGrid: React.FC<{
    userId: string;
}> = ({ userId }) => {
    const client = useApolloClient();
    const [dialogVisibility, setDialogVisibility] = React.useState<boolean>(false);
    const [selectionModel, setSelectionModel] = React.useState<GridRowId[]>([]);

    const submit = async (data: GQLUserContentScopes) => {
        await client.mutate<GQLUpdateContentScopesMutation, GQLUpdateContentScopesMutationVariables>({
            mutation: gql`
                mutation UpdateContentScopes($userId: String!, $input: UserContentScopesInput!) {
                    userPermissionsUpdateContentScopes(userId: $userId, input: $input)
                }
            `,
            variables: {
                userId,
                input: {
                    contentScopes: data,
                },
            },
            refetchQueries: ["ContentScopes"],
        });
    };

    const { data, loading, error } = useQuery<GQLContentScopesQuery, GQLContentScopesQueryVariables>(
        gql`
            query ContentScopes($userId: String!) {
                availableContentScopes: userPermissionsAvailableContentScopes
                userContentScopes: userPermissionsContentScopes(userId: $userId)
                userContentScopesSkipManual: userPermissionsContentScopes(userId: $userId, skipManual: true)
            }
        `,
        {
            variables: { userId },
        },
    );

    const deleteContentScope = (row: GQLUserContentScopes[number]) => {
        if (!data) return;
        const modiefiedData = data?.userContentScopes.filter(
            (contentScope: GQLUserContentScopes[number]) => JSON.stringify(contentScope) != JSON.stringify(row),
        );

        submit(modiefiedData);
    };
    let columns: GridColDef<GQLUserContentScopes>[] = [];

    if (!loading) {
        columns = [
            ...Object.keys(data?.userContentScopes[0]).map((key) => ({
                field: key,
                flex: 1,
                pinnable: false,
                headerName: camelCaseToHumanReadable(key),
                renderCell: ({ row }: GQLUserContentScopes[number]) => camelCaseToHumanReadable(row[key]),
            })),
            {
                field: "actions",
                width: 120,
                headerName: "",
                sortable: false,
                pinnable: false,
                filterable: false,
                renderCell: ({ row }) => (
                    <>
                        <IconButton
                            color="inherit"
                            onClick={() => {
                                deleteContentScope(row);
                            }}
                        >
                            <Delete />
                        </IconButton>
                    </>
                ),
            },
        ];
    }

    if (error) throw new Error(error.message);

    const deleteSelected = () => {
        if (!data) return;
        const modiefiedData = data?.userContentScopes.filter((contentScope: GQLUserContentScopes[number]) =>
            selectionModel.map((row) => JSON.stringify(row)).includes(JSON.stringify(contentScope)),
        );

        submit(modiefiedData);
    };

    const openSetContentScopesDialog = () => {
        setDialogVisibility(true);
    };

    return (
        <FieldSet title={<FormattedMessage id="comet.userPermissions.scopes" defaultMessage="Assigned Scopes" />} initiallyExpanded disablePadding>
            <Card>
                <DataGrid<GQLUserContentScopes>
                    autoHeight
                    checkboxSelection
                    disableSelectionOnClick
                    getRowId={(row) => {
                        return JSON.stringify(row);
                    }}
                    selectionModel={selectionModel}
                    onSelectionModelChange={(newSelectionModel) => {
                        setSelectionModel(newSelectionModel);
                    }}
                    rows={data?.userContentScopes ?? []}
                    columns={columns}
                    rowCount={data?.userContentScopes.length ?? 0}
                    loading={loading}
                    getRowHeight={() => "auto"}
                    sx={{ "&.MuiDataGrid-root .MuiDataGrid-cell": { py: "8px" } }}
                    components={{
                        Toolbar: () => <ContentScopeGridToolbar actions={{ openDialog: openSetContentScopesDialog, deleteSelected }} />,
                        OpenFilterButtonIcon: () => <Filter />,
                    }}
                />
                {dialogVisibility && <ContentScopeDialog userId={userId} handleDialogClose={() => setDialogVisibility(false)} />}
            </Card>
        </FieldSet>
    );
};
