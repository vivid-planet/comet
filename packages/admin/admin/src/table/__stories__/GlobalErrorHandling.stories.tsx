import { gql } from "@apollo/client";

import { Table } from "../Table";
import { TableQuery } from "../TableQuery";
import { useTableQuery } from "../useTableQuery";

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
}

interface QueryData {
    users: User[];
}

export default {
    title: "@comet/admin/table/globalErrorHandling",
    args: {
        query: "query users { users { id name username email } }",
    },
    argTypes: {
        query: {
            name: "GQL Query",
        },
    },
};

type Args = {
    query: string;
};

export const GlobalErrorHandling = {
    render: ({ query }: Args) => {
        const { tableData, api, loading, error } = useTableQuery<QueryData, Record<string, unknown>>()(
            gql`
                ${query}
            `,
            {
                resolveTableData: (data) => ({
                    data: data.users,
                    totalCount: data.users.length,
                }),
                globalErrorHandling: true,
            },
        );

        return (
            <TableQuery api={api} loading={loading} error={error}>
                {tableData && (
                    <Table
                        {...tableData}
                        columns={[
                            {
                                name: "id",
                                header: "Id",
                            },
                            {
                                name: "name",
                                header: "Name",
                            },
                            {
                                name: "username",
                                header: "Username",
                            },
                            {
                                name: "email",
                                header: "Email",
                            },
                        ]}
                    />
                )}
            </TableQuery>
        );
    },
};
