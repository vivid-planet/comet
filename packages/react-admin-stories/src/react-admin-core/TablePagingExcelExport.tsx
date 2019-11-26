import { ApolloProvider } from "@apollo/react-hooks";
import { storiesOf } from "@storybook/react";
import {
    createRestPagingActions,
    ExcelExportButton,
    Table,
    TableQuery,
    useTableCurrentPageExportExcel,
    useTableQuery,
    useTableQueryAllPagesExportExcel,
    useTableQueryPaging,
} from "@vivid-planet/react-admin-core";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { RestLink } from "apollo-link-rest";
import gql from "graphql-tag";
import * as React from "react";

const gqlRest = gql;

const query = gqlRest`
query people(
    $page: Int
) {
    people(
        page: $page
    ) @rest(type: "PeoplePayload", path: "people?page={args.page}") {
        count
        next
        previous
        results @type(name: "People") {
            name
            url
        }
    }
}
`;
interface IPeople {
    id: string;
    name: string;
    url: string;
}
interface IQueryData {
    people: {
        count: number;
        next: string;
        previous: string;
        results: IPeople[];
    };
}

interface IVariables {
    page: number;
}

function Story() {
    const pagingApi = useTableQueryPaging(1);
    const tableQuery = useTableQuery<IQueryData, IVariables>()(query, {
        variables: {
            page: pagingApi.current,
        },
        resolveTableData: data => ({
            data: data.people.results.map(i => ({ ...i, id: i.url.match(/.*\/(\d+)\//)![1] })),
            totalCount: data.people.count,
            pagingInfo: createRestPagingActions(pagingApi, {
                totalPages: Math.ceil(data.people.count / 10), // Don't calculate this in a real application
                nextPage: data.people.next,
                previousPage: data.people.previous,
            }),
        }),
        notifyOnNetworkStatusChange: true,
    });
    const { tableData, api, loading, error } = tableQuery;

    const exportExcelApi = useTableQueryAllPagesExportExcel<IPeople, IVariables>(tableQuery, page => {
        return { page };
    });

    return (
        <>
            <TableQuery api={api} loading={loading} error={error}>
                <ExcelExportButton exportApi={exportExcelApi}>Export All Pages</ExcelExportButton>
                {tableData && (
                    <Table
                        exportExcelApi={exportExcelApi}
                        {...tableData}
                        columns={[
                            {
                                name: "name",
                                header: "Name",
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
                uri: "https://swapi.co/api/",
            }),
        ]);

        const cache = new InMemoryCache();

        const client = new ApolloClient({
            link,
            cache,
        });

        return <ApolloProvider client={client}>{story()}</ApolloProvider>;
    })
    .add("Table Paging Excel Export", () => <Story />);
