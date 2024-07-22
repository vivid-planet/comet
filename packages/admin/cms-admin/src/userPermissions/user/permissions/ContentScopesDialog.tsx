import { gql, useApolloClient, useQuery } from "@apollo/client";
import { CancelButton, Loading } from "@comet/admin";
import { Check, Close, Filter } from "@comet/admin-icons";
import { Button, Dialog, DialogActions, DialogTitle, IconButton, styled, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams, GridRowId, GridRowParams } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { camelCaseToHumanReadable } from "../../utils/camelCaseToHumanReadable";
import {
    GQLContentScopesQuery,
    GQLContentScopesQueryVariables,
    GQLUpdateContentScopesMutation,
    GQLUpdateContentScopesMutationVariables,
} from "./ContentScopeGrid.generated";
import { ContentScopeGridToolbar } from "./ContentScopeGridToolbar";

interface FormProps {
    userId: string;
    handleDialogClose: () => void;
}

type GQLAvailableContentScopes = GQLContentScopesQuery["availableContentScopes"];

export const ContentScopeDialog: React.FC<FormProps> = ({ userId, handleDialogClose }) => {
    const client = useApolloClient();
    const intl = useIntl();
    const [selectionModel, setSelectionModel] = React.useState<GridRowId[]>([]);
    const submit = async (submitData: GridRowId[]) => {
        await client.mutate<GQLUpdateContentScopesMutation, GQLUpdateContentScopesMutationVariables>({
            mutation: gql`
                mutation UpdateContentScopes($userId: String!, $input: UserContentScopesInput!) {
                    userPermissionsUpdateContentScopes(userId: $userId, input: $input)
                }
            `,
            variables: {
                userId,
                input: {
                    contentScopes: submitData.map((scope) => JSON.parse(scope as string).contentScope),
                },
            },
            refetchQueries: ["ContentScopes"],
        });

        handleDialogClose();
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
    useEffect(() => {
        if (data) {
            const selectedRows = data?.userContentScopes.map((row: GQLContentScopesQuery["userContentScopes"][number]) => JSON.stringify(row));

            setSelectionModel(selectedRows);
        }
    }, [data]);

    if (error) {
        throw new Error(error.message);
    }

    let columns: GridColDef<GQLAvailableContentScopes[number]>[] = [];
    columns = [
        {
            field: "scopeName",
            flex: 1,
            pinnable: false,
            headerName: intl.formatMessage({ id: "comet.userPermissions.contentScope", defaultMessage: "Scope Name" }),
            renderCell: ({ row }: GridRenderCellParams<GQLAvailableContentScopes[number]>) => {
                return (
                    <Typography>
                        {row?.label
                            ? row?.label
                            : Object.entries(row.contentScope).map(([_, value]) => `${camelCaseToHumanReadable(value as string)} `)}
                    </Typography>
                );
            },
        },
    ];

    return (
        <Dialog maxWidth="lg" open={true}>
            <CustomDialogTitle>
                <FormattedMessage id="comet.contentScope.select" defaultMessage="Select Scopes" />
                <CustomIconButton color="inherit" onClick={handleDialogClose}>
                    <Close />
                </CustomIconButton>
            </CustomDialogTitle>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <DataGrid<GQLAvailableContentScopes[number]>
                        autoHeight
                        checkboxSelection
                        getRowId={(row) => {
                            return JSON.stringify(row.contentScope);
                        }}
                        selectionModel={selectionModel}
                        onSelectionModelChange={(newSelectionModel) => {
                            setSelectionModel(newSelectionModel);
                        }}
                        isRowSelectable={(params: GridRowParams) => {
                            return data
                                ? !data.userContentScopesSkipManual.some(
                                      (automaticScopes) => JSON.stringify(params.row.contentScope) === JSON.stringify(automaticScopes),
                                  )
                                : false;
                        }}
                        rows={data ? data?.availableContentScopes : []}
                        columns={columns}
                        rowCount={data?.availableContentScopes.length ?? 0}
                        loading={loading}
                        getRowHeight={() => "auto"}
                        components={{
                            Toolbar: () => <ContentScopeGridToolbar />,
                            OpenFilterButtonIcon: () => <Filter />,
                        }}
                    />
                    <DialogActions>
                        <CancelButton onClick={handleDialogClose}>
                            <FormattedMessage id="comet.contentScopes.cancel" defaultMessage="Cancel" />
                        </CancelButton>
                        <Button variant="contained" color="primary" startIcon={<Check />} onClick={() => submit(selectionModel)}>
                            <FormattedMessage id="comet.contentScope.submit" defaultMessage="Apply" />
                        </Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
};

const CustomDialogTitle = styled(DialogTitle)`
    display: flex;
    justify-content: space-between;
`;

const CustomIconButton = styled(IconButton)`
    padding: 0px;
`;
