import { storiesOf } from "@storybook/react";
import {
    createRestPagingActions,
    SortDirection,
    Table,
    TableFilterFinalForm,
    TableQuery,
    useTableQuery,
    useTableQueryFilter,
    useTableQueryPaging,
    useTableQuerySort,
} from "@vivid-planet/react-admin-core";
import { Field, FieldContainerLabelAbove, Input } from "@vivid-planet/react-admin-form";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { RestLink } from "apollo-link-rest";
import gql from "graphql-tag";
import * as React from "react";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";

const gqlRest = gql;

const query = gqlRest`
query users(
    $page: Int
    $sort: String
    $order: String
    $query: String
) {
    users(
        page: $page
        sort: $sort
        order: $order
        query: $query
    ) @rest(type: "UsersPayload", path: "users?q={args.query}&_page={args.page}&_limit=5&_sort={args.sort}&_order={args.order}") {
        meta @type(name: "UsersMeta") {
            totalCount
            links
        }
        data @type(name: "User") {
            id
            name
            username
            email
        }
    }
}
`;

interface IQueryData {
    users: {
        meta: {
            totalCount: number;
            links: IResponseLinks;
        };
        data: Array<{
            id: number;
            name: string;
            username: string;
            email: string;
        }>;
    };
}

interface IVariables extends IFilterValues {
    page: number;
    sort: string;
    order: string;
}
interface IFilterValues {
    query: string;
}

function Story() {
    const filterApi = useTableQueryFilter<IFilterValues>({ query: "" });

    const pagingApi = useTableQueryPaging(1);
    const sortApi = useTableQuerySort({
        columnName: "name",
        direction: SortDirection.ASC,
    });
    const { tableData, api, loading, error } = useTableQuery<IQueryData, IVariables>()(query, {
        variables: {
            sort: sortApi.current.columnName,
            order: sortApi.current.direction,
            page: pagingApi.current,
            ...filterApi.current,
        },
        resolveTableData: data => ({
            data: data.users.data,
            totalCount: data.users.meta.totalCount,
            pagingInfo: createRestPagingActions(
                pagingApi,
                {
                    nextPage: data.users.meta.links.next,
                    previousPage: data.users.meta.links.prev,
                    totalPages: data.users.meta.totalCount / 5,
                },
                {
                    pageParameterName: "_page",
                },
            ),
        }),
    });

    return (
        <TableQuery api={api} loading={loading} error={error}>
            {tableData && (
                <>
                    <TableFilterFinalForm<IFilterValues> filterApi={filterApi}>
                        <Field
                            name="query"
                            type="text"
                            label="Query"
                            component={Input}
                            fullWidth
                            fieldContainerComponent={FieldContainerLabelAbove}
                        />
                    </TableFilterFinalForm>
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
                </>
            )}
        </TableQuery>
    );
}

interface IResponseLinks {
    first?: string;
    prev?: string;
    next?: string;
    last?: string;
}
storiesOf("react-admin-core", module)
    .addDecorator(story => {
        const link = ApolloLink.from([
            new RestLink({
                uri: "https://jsonplaceholder.typicode.com/",
                responseTransformer: async response => {
                    const links: IResponseLinks = {};
                    response.headers
                        .get("link")
                        .match(/<(.*?)>; rel="(.*?)"/g)
                        .forEach((i: string) => {
                            const m = i.match(/<(.*?)>; rel="(.*?)"/);
                            if (m) {
                                links[m[2] as keyof IResponseLinks] = m[1];
                            }
                        });
                    return {
                        data: await response.json(),
                        meta: {
                            links,
                            totalCount: response.headers.get("x-total-count"),
                        },
                    };
                },
            }),
        ]);

        const cache = new InMemoryCache();

        const client = new ApolloClient({
            link,
            cache,
        });

        return <ApolloHooksProvider client={client}>{story()}</ApolloHooksProvider>;
    })
    .add("Table Filter Paging Sort", () => <Story />);
