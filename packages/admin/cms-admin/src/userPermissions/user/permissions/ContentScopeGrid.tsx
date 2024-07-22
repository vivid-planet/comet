import { gql, useApolloClient, useQuery } from "@apollo/client";
import { FieldSet } from "@comet/admin";
import { Delete, Filter } from "@comet/admin-icons";
import { Card, IconButton, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRowId, GridRowParams } from "@mui/x-data-grid";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

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
    const intl = useIntl();
    const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
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
                availableContentScopes: userPermissionsAvailableContentScopes {
                    contentScope
                    label
                }
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
    let columns: GridColDef<GQLUserContentScopes[number]>[] = [];

    columns = [
        {
            field: "scopeName",
            flex: 1,
            pinnable: false,
            headerName: intl.formatMessage({ id: "comet.userPermissions.contentScope", defaultMessage: "Scope Name" }),
            renderCell: ({ row }: GQLUserContentScopes[number]) => {
                const contentScope = data?.availableContentScopes.find((scope) => JSON.stringify(scope.contentScope) == JSON.stringify(row));
                if (contentScope) {
                    return (
                        <Typography
                            color={
                                data?.userContentScopesSkipManual.some((automaticScopes) => JSON.stringify(row) === JSON.stringify(automaticScopes))
                                    ? "#B3B3B3"
                                    : "info"
                            }
                        >
                            {contentScope.label
                                ? contentScope.label
                                : Object.entries(contentScope.contentScope).map(([_, value]) => `${camelCaseToHumanReadable(value as string)} `)}
                        </Typography>
                    );
                }
            },
        },
        {
            field: "actions",
            width: 120,
            headerName: "",
            sortable: false,
            pinnable: false,
            filterable: false,
            renderCell: ({ row }) => {
                const isProgrammaticallyApplied = data?.userContentScopesSkipManual.some(
                    (automaticScopes) => JSON.stringify(row) === JSON.stringify(automaticScopes),
                );

                return (
                    <>
                        <IconButton
                            color="inherit"
                            disabled={isProgrammaticallyApplied}
                            onClick={() => {
                                deleteContentScope(row);
                            }}
                        >
                            <Delete />
                        </IconButton>
                    </>
                );
            },
        },
    ];

    if (error) throw new Error(error.message);

    const openSetContentScopesDialog = () => {
        setDialogOpen(true);
    };

    return (
        <FieldSet
            title={<FormattedMessage id="comet.userPermissions.scopes.assigned" defaultMessage="Assigned Scopes" />}
            initiallyExpanded
            disablePadding
        >
            <Card>
                <DataGrid<GQLUserContentScopes[number]>
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
                    isRowSelectable={(params: GridRowParams) => {
                        return data
                            ? !data.userContentScopesSkipManual.some(
                                  (automaticScopes) => JSON.stringify(params.row) === JSON.stringify(automaticScopes),
                              )
                            : false;
                    }}
                    rows={data?.userContentScopes ?? []}
                    columns={columns}
                    rowCount={data?.userContentScopes.length ?? 0}
                    loading={loading}
                    getRowHeight={() => "auto"}
                    sx={{ "&.MuiDataGrid-root .MuiDataGrid-cell": { py: "8px" } }}
                    components={{
                        Toolbar: () => <ContentScopeGridToolbar actions={{ openDialog: openSetContentScopesDialog }} />,
                        OpenFilterButtonIcon: () => <Filter />,
                    }}
                />
                {dialogOpen && <ContentScopeDialog userId={userId} handleDialogClose={() => setDialogOpen(false)} />}
            </Card>
        </FieldSet>
    );
};
