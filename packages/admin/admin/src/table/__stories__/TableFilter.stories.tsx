import { gql } from "@apollo/client";
import { Typography } from "@mui/material";

import { MainContent } from "../../common/MainContent";
import { ToolbarItem } from "../../common/toolbar/item/ToolbarItem";
import { Toolbar } from "../../common/toolbar/Toolbar";
import { Field } from "../../form/Field";
import { FinalFormInput } from "../../form/FinalFormInput";
import { Table } from "../Table";
import { TableFilterFinalForm } from "../TableFilterFinalForm";
import { TableQuery } from "../TableQuery";
import { useTableQuery } from "../useTableQuery";
import { useTableQueryFilter } from "../useTableQueryFilter";

export default {
    title: "@comet/admin/table",
};

export const Filter = () => {
    const filterApi = useTableQueryFilter<{ query?: string }>({});
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
            variables: filterApi.current,
            resolveTableData: (data) => ({
                data: data.users,
                totalCount: data.users.length,
            }),
        },
    );

    return (
        <TableQuery api={api} loading={loading} error={error}>
            <>
                <Toolbar>
                    <ToolbarItem>
                        <Typography variant="h3">Filter</Typography>
                    </ToolbarItem>
                    <ToolbarItem>
                        <TableFilterFinalForm filterApi={filterApi}>
                            <Field name="query" type="text" component={FinalFormInput} fullWidth />
                        </TableFilterFinalForm>
                    </ToolbarItem>
                </Toolbar>
                {tableData && (
                    <MainContent>
                        <Table
                            {...tableData}
                            columns={[
                                { name: "name", header: "Name", sortable: true },
                                { name: "username", header: "Username", sortable: true },
                                { name: "email", header: "E-Mail", sortable: true },
                            ]}
                        />
                    </MainContent>
                )}
            </>
        </TableQuery>
    );
};
