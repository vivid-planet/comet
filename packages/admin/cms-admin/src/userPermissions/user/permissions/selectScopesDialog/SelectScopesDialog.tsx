import { useApolloClient } from "@apollo/client";
import {
    CancelButton,
    DataGridToolbar,
    Field,
    FinalForm,
    SaveBoundary,
    SaveBoundarySaveButton,
    ToolbarFillSpace,
    ToolbarItem,
    useFormApiRef,
} from "@comet/admin";
import { Dialog, DialogActions, DialogTitle } from "@mui/material";
import { DataGrid, GridColDef, GridToolbarQuickFilter } from "@mui/x-data-grid";
import gql from "graphql-tag";
import { FormattedMessage, useIntl } from "react-intl";

import { generateGridColumnsFromContentScopeProperties } from "../ContentScopeGrid";
import { GQLContentScopesQuery } from "../ContentScopeGrid.generated";
import { GQLUpdateContentScopesMutation, GQLUpdateContentScopesMutationVariables } from "./SelectScopesDialog.generated";

export interface SelectScopesDialogProps {
    open: boolean;
    onClose: () => void;
    data: GQLContentScopesQuery;
    userId: string;
}

type FormValues = {
    contentScopes: string[];
};

type ContentScope = {
    [key: string]: string;
};

function SelectScopesGridToolbar() {
    return (
        <DataGridToolbar>
            <ToolbarItem>
                <GridToolbarQuickFilter />
            </ToolbarItem>
            <ToolbarFillSpace />
        </DataGridToolbar>
    );
}

export const SelectScopesDialog: React.FunctionComponent<React.PropsWithChildren<SelectScopesDialogProps>> = ({ open, onClose, data, userId }) => {
    const client = useApolloClient();
    const intl = useIntl();
    const formApiRef = useFormApiRef<FormValues>();
    const submit = async (values: FormValues) => {
        await client.mutate<GQLUpdateContentScopesMutation, GQLUpdateContentScopesMutationVariables>({
            mutation: gql`
                mutation UpdateContentScopes($userId: String!, $input: UserContentScopesInput!) {
                    userPermissionsUpdateContentScopes(userId: $userId, input: $input)
                }
            `,
            variables: {
                userId,
                input: {
                    contentScopes: values.contentScopes.map((contentScope) => JSON.parse(contentScope)),
                },
            },
            refetchQueries: ["ContentScopes"],
        });
    };

    const columns: GridColDef<{ [key in string]: string }>[] = generateGridColumnsFromContentScopeProperties(
        data?.availableContentScopes || [],
        intl,
    );

    return (
        <SaveBoundary
            onAfterSave={() => {
                onClose();
            }}
        >
            <Dialog open={open} maxWidth="lg">
                <DialogTitle>
                    <FormattedMessage id="comet.userScopes.dialog.title" defaultMessage="Select scopes" />
                </DialogTitle>
                <FinalForm<FormValues>
                    apiRef={formApiRef}
                    subscription={{ values: true }}
                    mode="edit"
                    onSubmit={submit}
                    onAfterSubmit={() => null}
                    initialValues={{
                        contentScopes: data.userContentScopes.map((cs) => JSON.stringify(cs)),
                    }}
                >
                    <Field name="contentScopes" fullWidth>
                        {(props) => {
                            return (
                                <DataGrid
                                    autoHeight={true}
                                    rows={
                                        data.availableContentScopes.filter((obj) => !Object.values(obj).every((value) => value === undefined)) ?? []
                                    }
                                    columns={columns}
                                    rowCount={data?.availableContentScopes.length ?? 0}
                                    loading={false}
                                    getRowHeight={() => "auto"}
                                    getRowId={(row) => JSON.stringify(row)}
                                    isRowSelectable={(params) => {
                                        return !data.userContentScopesSkipManual.some(
                                            (cs: ContentScope) => JSON.stringify(cs) === JSON.stringify(params.row),
                                        );
                                    }}
                                    checkboxSelection
                                    sx={{ "&.MuiDataGrid-root .MuiDataGrid-cell": { py: "8px" }, width: "100%" }}
                                    selectionModel={props.input.value}
                                    onSelectionModelChange={(selectionModel) => {
                                        props.input.onChange(selectionModel.map((id) => String(id)));
                                    }}
                                    components={{
                                        Toolbar: SelectScopesGridToolbar,
                                    }}
                                />
                            );
                        }}
                    </Field>
                </FinalForm>
                <DialogActions>
                    <CancelButton onClick={onClose}>
                        <FormattedMessage id="comet.userScopes.close" defaultMessage="Close" />
                    </CancelButton>
                    <SaveBoundarySaveButton />
                </DialogActions>
            </Dialog>
        </SaveBoundary>
    );
};
