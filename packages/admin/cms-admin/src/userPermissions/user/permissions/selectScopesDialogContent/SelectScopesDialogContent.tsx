import { useApolloClient, useQuery } from "@apollo/client";
import { DataGridToolbar, Field, FinalForm, Loading, ToolbarFillSpace, ToolbarItem, useFormApiRef } from "@comet/admin";
import { DataGrid, GridColDef, GridToolbarQuickFilter } from "@mui/x-data-grid";
import gql from "graphql-tag";
import isEqual from "lodash.isequal";

import { generateGridColumnsFromContentScopeProperties } from "../ContentScopeGrid";
import { GQLContentScopesQuery } from "../ContentScopeGrid.generated";
import {
    GQLAvailableContentScopesQuery,
    GQLUpdateContentScopesMutation,
    GQLUpdateContentScopesMutationVariables,
} from "./SelectScopesDialogContent.generated";

export interface SelectScopesDialogContentProps {
    userId: string;
    userContentScopes: GQLContentScopesQuery["userContentScopes"];
    userContentScopesSkipManual: GQLContentScopesQuery["userContentScopesSkipManual"];
}

type FormValues = {
    contentScopes: string[];
};

type ContentScope = {
    [key: string]: string;
};

function SelectScopesDialogContentGridToolbar() {
    return (
        <DataGridToolbar>
            <ToolbarItem>
                <GridToolbarQuickFilter />
            </ToolbarItem>
            <ToolbarFillSpace />
        </DataGridToolbar>
    );
}

export const SelectScopesDialogContent: React.FunctionComponent<React.PropsWithChildren<SelectScopesDialogContentProps>> = ({
    userId,
    userContentScopes,
    userContentScopesSkipManual,
}) => {
    const client = useApolloClient();
    const formApiRef = useFormApiRef<FormValues>();

    const { data, error } = useQuery<GQLAvailableContentScopesQuery>(
        gql`
            query AvailableContentScopes {
                availableContentScopes: userPermissionsAvailableContentScopes
            }
        `,
    );

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

    if (error) throw new Error(error.message);

    if (!data) {
        return <Loading />;
    }

    const columns: GridColDef<ContentScope>[] = generateGridColumnsFromContentScopeProperties(data.availableContentScopes);

    return (
        <FinalForm<FormValues>
            apiRef={formApiRef}
            subscription={{ values: true }}
            mode="edit"
            onSubmit={submit}
            onAfterSubmit={() => null}
            initialValues={{
                contentScopes: userContentScopes.map((cs) => JSON.stringify(cs)),
            }}
        >
            <Field name="contentScopes" fullWidth>
                {(props) => {
                    return (
                        <DataGrid
                            autoHeight={true}
                            rows={data.availableContentScopes.filter((obj) => !Object.values(obj).every((value) => value === undefined)) ?? []}
                            columns={columns}
                            rowCount={data.availableContentScopes.length}
                            loading={false}
                            getRowHeight={() => "auto"}
                            getRowId={(row) => JSON.stringify(row)}
                            isRowSelectable={(params) => {
                                return !userContentScopesSkipManual.some((cs: ContentScope) => isEqual(cs, params.row));
                            }}
                            checkboxSelection
                            selectionModel={props.input.value}
                            onSelectionModelChange={(selectionModel) => {
                                props.input.onChange(selectionModel.map((id) => String(id)));
                            }}
                            components={{
                                Toolbar: SelectScopesDialogContentGridToolbar,
                            }}
                            pageSize={25}
                        />
                    );
                }}
            </Field>
        </FinalForm>
    );
};
