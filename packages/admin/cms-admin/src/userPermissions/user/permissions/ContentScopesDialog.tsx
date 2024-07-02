import { gql, useApolloClient, useQuery } from "@apollo/client";
import { CancelButton, Loading } from "@comet/admin";
import { Check, Close, Filter } from "@comet/admin-icons";
import { Button, Dialog, DialogActions, DialogTitle, IconButton, styled } from "@mui/material";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";

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
    const [selectionModel, setSelectionModel] = React.useState<GridRowId[]>([]);
    const submit = async (submitData: GQLAvailableContentScopes) => {
        await client.mutate<GQLUpdateContentScopesMutation, GQLUpdateContentScopesMutationVariables>({
            mutation: gql`
                mutation UpdateContentScopes($userId: String!, $input: UserContentScopesInput!) {
                    userPermissionsUpdateContentScopes(userId: $userId, input: $input)
                }
            `,
            variables: {
                userId,
                input: {
                    contentScopes: submitData.map((scopeId) => JSON.parse(scopeId)),
                },
            },
            refetchQueries: ["ContentScopes"],
        });

        handleDialogClose();
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
    useEffect(() => {
        if (data) {
            const selectedRows = data?.userContentScopes.map((row: GQLContentScopesQuery["userContentScopes"][number]) => JSON.stringify(row));
            setSelectionModel(selectedRows);
        }
    }, [data]);

    if (error) {
        throw new Error(error.message);
    }

    let columns: GridColDef<GQLAvailableContentScopes>[] = [];

    if (!loading) {
        columns = [
            ...Object.keys(data?.availableContentScopes[0]).map((key) => ({
                field: key,
                flex: 1,
                pinnable: false,
                headerName: camelCaseToHumanReadable(key),
                renderCell: ({ row }: GQLAvailableContentScopes[number]) => `${row[key]}`,
            })),
        ];
    }

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
                    <DataGrid<GQLAvailableContentScopes>
                        autoHeight
                        checkboxSelection
                        getRowId={(row) => {
                            return JSON.stringify(row);
                        }}
                        selectionModel={selectionModel}
                        onSelectionModelChange={(newSelectionModel) => {
                            setSelectionModel(newSelectionModel);
                        }}
                        rows={data?.availableContentScopes ?? []}
                        columns={columns}
                        rowCount={data?.availableContentScopes.length ?? 0}
                        loading={loading}
                        getRowHeight={() => "auto"}
                        sx={{ "&.MuiDataGrid-root .MuiDataGrid-cell": { py: "8px" } }}
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
