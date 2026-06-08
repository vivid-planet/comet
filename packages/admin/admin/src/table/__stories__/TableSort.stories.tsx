import { gql } from "@apollo/client";

import { Table } from "../Table";
import { TableQuery } from "../TableQuery";
import { useTableQuery } from "../useTableQuery";
import { SortDirection, useTableQuerySort } from "../useTableQuerySort";

export default {
    title: "@comet/admin/table",
};

export const Sort = () => {
    const sortApi = useTableQuerySort({
        columnName: "name",
        direction: SortDirection.ASC,
    });
    const { tableData, api, loading, error } = useTableQuery<
        { users: { id: number; name: string; username: string; email: string }[] },
        { sort?: string; order?: string }
    >()(
        gql`
            query users($sort: String, $order: String) {
                users(sort: $sort, order: $order) {
                    id
                    name
                    username
                    email
                }
            }
        `,
        {
            variables: {
                sort: sortApi.current.columnName,
                order: sortApi.current.direction,
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
                <Table
                    sortApi={sortApi}
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
            )}
        </TableQuery>
    );
};
