import { ApolloProvider } from "@apollo/react-hooks";
import { storiesOf } from "@storybook/react";
import {
    ExcelExportButton,
    SortDirection,
    Table,
    TableQuery,
    useTableCurrentPageExportExcel,
    useTableQuery,
    useTableQuerySort,
} from "@vivid-planet/react-admin-core";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { RestLink } from "apollo-link-rest";
import gql from "graphql-tag";
import * as React from "react";

const gqlRest = gql;

const query = gqlRest`
query users(
    $sort: String
    $order: String
) {
    users(
        sort: $sort
        order: $order
    ) @rest(type: "User", path: "users?_sort={args.sort}&_order={args.order}") {
        id
        name
        username
        email
    }
}
`;

interface IUser {
    id: number;
    name: string;
    username: string;
    email: string;
}
interface IQueryData {
    users: IUser[];
}

interface IVariables {
    blubId: number;
    sort: string;
    order: "desc" | "asc";
}

function Story() {
    const sortApi = useTableQuerySort({
        columnName: "name",
        direction: SortDirection.ASC,
    });
    const { tableData, api, loading, error } = useTableQuery<IQueryData, IVariables>()(query, {
        variables: {
            blubId: 123,
            sort: sortApi.current.columnName,
            order: sortApi.current.direction,
        },
        resolveTableData: data => ({
            data: data.users,
            totalCount: data.users.length,
        }),
    });

    const excelExportApi = useTableCurrentPageExportExcel();
    return (
        <>
            <ExcelExportButton exportApi={excelExportApi} />
            <TableQuery api={api} loading={loading} error={error}>
                {tableData && (
                    <Table
                        exportExcelApi={excelExportApi}
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
        </>
    );
}

storiesOf("react-admin-core", module)
    .addDecorator(story => {
        const link = ApolloLink.from([
            new RestLink({
                uri: "https://jsonplaceholder.typicode.com/",
            }),
        ]);

        const cache = new InMemoryCache();

        const client = new ApolloClient({
            link,
            cache,
        });

        return <ApolloProvider client={client}>{story()}</ApolloProvider>;
    })
    .add("Table Sort Excel Export", () => <Story />);
