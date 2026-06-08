import { gql } from "@apollo/client";
import { Grid } from "@mui/material";

import { AutocompleteField } from "../../form/fields/AutocompleteField";
import { Table } from "../Table";
import { TableFilterFinalForm } from "../TableFilterFinalForm";
import { TableQuery } from "../TableQuery";
import { useTableQuery } from "../useTableQuery";
import { useTableQueryFilter } from "../useTableQueryFilter";

interface IFilterValues {
    selectQuery?: { label: string; value: string };
}

export default {
    title: "@comet/admin/table",
};

export const ResetFilter = () => {
    const filterApi = useTableQueryFilter<IFilterValues>({});
    const { tableData, api, loading, error } = useTableQuery<
        { users: { id: number; name: string; username: string; email: string }[] },
        { query?: string }
    >()(
        gql`
            query users($query: String) {
                users(query: $query) {
                    id
                    name
                    username
                    email
                }
            }
        `,
        {
            variables: {
                query: filterApi.current.selectQuery?.value,
            },
            resolveTableData: (data) => ({
                data: data.users,
                totalCount: data.users.length,
            }),
        },
    );

    return (
        <TableQuery api={api} loading={loading} error={error}>
            {tableData && (
                <>
                    <TableFilterFinalForm filterApi={filterApi} resetButton>
                        <Grid container>
                            <Grid size={2}>
                                <AutocompleteField
                                    name="selectQuery"
                                    options={[
                                        { label: "Leanne Graham", value: "Leanne Graham" },
                                        { label: "Ervin Howell", value: "Ervin Howell" },
                                        { label: "Clementine Bauch", value: "Clementine Bauch" },
                                    ]}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </TableFilterFinalForm>
                    <Table
                        {...tableData}
                        columns={[
                            {
                                name: "name",
                                header: "Name",
                                sortable: true,
                            },
                            {
                                name: "username",
                                header: "Username",
                                sortable: true,
                            },
                            {
                                name: "email",
                                header: "E-Mail",
                                sortable: true,
                            },
                        ]}
                    />
                </>
            )}
        </TableQuery>
    );
};
