import { ApolloProvider } from "@apollo/react-hooks";
import { storiesOf } from "@storybook/react";
import {
    ExcelExportButton,
    Table,
    TableFilterFinalForm,
    TableQuery,
    useTableCurrentPageExportExcel,
    useTableQuery,
    useTableQueryFilter,
} from "@vivid-planet/react-admin-core";
import { Field, FieldContainerLabelAbove, Input } from "@vivid-planet/react-admin-form";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { RestLink } from "apollo-link-rest";
import gql from "graphql-tag";
import * as React from "react";

const gqlRest = gql;

const query = gqlRest`
query users(
    $query: String
) {
    users(
        query: $query
    ) @rest(type: "User", path: "users?q={args.query}") {
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

interface IFilterValues {
    query: string;
}
interface IVariables extends IFilterValues {}

function Story() {
    const filterApi = useTableQueryFilter<IFilterValues>({ query: "" });
    const exportExcelApi = useTableCurrentPageExportExcel<IUser>();

    const { tableData, api, loading, error } = useTableQuery<IQueryData, IVariables>()(query, {
        variables: {
            ...filterApi.current,
        },
        resolveTableData: data => ({
            data: data.users,
            totalCount: data.users.length,
        }),
    });

    return (
        <TableQuery api={api} loading={loading} error={error}>
            {tableData && (
                <>
                    <TableFilterFinalForm filterApi={filterApi}>
                        <Field
                            name="query"
                            type="text"
                            label="Query"
                            component={Input}
                            fullWidth
                            fieldContainerComponent={FieldContainerLabelAbove}
                        />
                    </TableFilterFinalForm>
                    <ExcelExportButton exportApi={exportExcelApi} />

                    <Table
                        exportExcelApi={exportExcelApi}
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
    .add("Table Filter Excel Export", () => <Story />);
