import { gql, useApolloClient, useQuery } from "@apollo/client";
import { CancelButton, DataGridToolbar, Field, FinalForm, FinalFormSwitch, SaveButton, ToolbarFillSpace, ToolbarItem } from "@comet/admin";
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { DataGrid, GridColDef, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { FormattedMessage } from "react-intl";

import { generateGridColumnsFromContentScopeProperties } from "./ContentScopeGrid";
import {
    GQLOverrideContentScopesMutation,
    GQLOverrideContentScopesMutationVariables,
    GQLPermissionContentScopesQuery,
    GQLPermissionContentScopesQueryVariables,
    namedOperations,
} from "./OverrideContentScopesDialog.generated";

interface FormSubmitData {
    overrideContentScopes: boolean;
    contentScopes: string[];
}
interface FormProps {
    permissionId: string;
    userId: string;
    handleDialogClose: () => void;
}
type ContentScope = {
    [key: string]: string;
};

function OverrideContentScopesDialogGridToolbar() {
    return (
        <DataGridToolbar>
            <ToolbarItem>
                <GridToolbarQuickFilter />
            </ToolbarItem>
            <ToolbarFillSpace />
        </DataGridToolbar>
    );
}

export const OverrideContentScopesDialog = ({ permissionId, userId, handleDialogClose }: FormProps) => {
    const client = useApolloClient();

    const submit = async (data: FormSubmitData) => {
        await client.mutate<GQLOverrideContentScopesMutation, GQLOverrideContentScopesMutationVariables>({
            mutation: gql`
                mutation OverrideContentScopes($input: UserPermissionOverrideContentScopesInput!) {
                    userPermissionsUpdateOverrideContentScopes(input: $input) {
                        id
                    }
                }
            `,
            variables: {
                input: {
                    permissionId,
                    overrideContentScopes: data.overrideContentScopes,
                    contentScopes: data.contentScopes.map((contentScope) => JSON.parse(contentScope)),
                },
            },
            refetchQueries: [namedOperations.Query.PermissionContentScopes, "Permissions"],
        });
        handleDialogClose();
    };

    const { data, error } = useQuery<GQLPermissionContentScopesQuery, GQLPermissionContentScopesQueryVariables>(
        gql`
            query PermissionContentScopes($permissionId: ID!, $userId: String!) {
                availableContentScopes: userPermissionsAvailableContentScopes
                permission: userPermissionsPermission(id: $permissionId, userId: $userId) {
                    source
                    overrideContentScopes
                    contentScopes
                }
                userContentScopesSkipManual: userPermissionsContentScopes(userId: $userId, skipManual: true)
            }
        `,
        {
            variables: { permissionId, userId },
        },
    );

    if (error) {
        throw new Error(error.message);
    }

    if (!data) {
        return <CircularProgress />;
    }

    const initialValues: FormSubmitData = {
        overrideContentScopes: data.permission.overrideContentScopes,
        contentScopes: data.permission.contentScopes.map((v) => JSON.stringify(v)),
    };
    const disabled = data && data.permission.source === "BY_RULE";

    const columns: GridColDef<ContentScope>[] = generateGridColumnsFromContentScopeProperties(data.availableContentScopes);

    return (
        <Dialog maxWidth="lg" open={true}>
            <FinalForm<FormSubmitData>
                mode="edit"
                onSubmit={submit}
                initialValues={initialValues}
                render={({ values }) => (
                    <>
                        <DialogTitle>
                            <FormattedMessage id="comet.userPermissions.scopes" defaultMessage="Scopes" />
                        </DialogTitle>
                        <DialogContent>
                            <Field
                                name="overrideContentScopes"
                                label={
                                    <FormattedMessage id="comet.userPermissions.overrideScopes" defaultMessage="Permission-specific Content-Scopes" />
                                }
                                component={FinalFormSwitch}
                                type="checkbox"
                                disabled={disabled}
                            />
                            {values.overrideContentScopes && (
                                <Field name="contentScopes" fullWidth>
                                    {(props) => {
                                        return (
                                            <DataGrid
                                                autoHeight={true}
                                                rows={
                                                    data.availableContentScopes.filter(
                                                        (obj) => !Object.values(obj).every((value) => value === undefined),
                                                    ) ?? []
                                                }
                                                columns={columns}
                                                rowCount={data.availableContentScopes.length}
                                                loading={false}
                                                getRowHeight={() => "auto"}
                                                getRowId={(row) => JSON.stringify(row)}
                                                checkboxSelection={!disabled}
                                                selectionModel={props.input.value}
                                                onSelectionModelChange={(selectionModel) => {
                                                    props.input.onChange(selectionModel.map((id) => String(id)));
                                                }}
                                                components={{
                                                    Toolbar: OverrideContentScopesDialogGridToolbar,
                                                }}
                                                pageSize={25}
                                            />
                                        );
                                    }}
                                </Field>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <CancelButton onClick={() => handleDialogClose()}>
                                <FormattedMessage id="comet.userPermissions.close" defaultMessage="Close" />
                            </CancelButton>
                            {!disabled && <SaveButton type="submit" />}
                        </DialogActions>
                    </>
                )}
            />
        </Dialog>
    );
};
