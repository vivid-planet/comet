import { ApolloProvider } from "@apollo/react-hooks";
import { storiesOf } from "@storybook/react";
import {
    createRestPagingActions,
    ExcelExportButton,
    Table,
    TableFilterFinalForm,
    TableQuery,
    useTableQuery,
    useTableQueryAllPagesExportExcel,
    useTableQueryFilter,
    useTableQueryPaging,
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
query people(
    $page: Int
    $query: String
) {
    people(
        page: $page
        query: $query
    ) @rest(type: "PeoplePayload", path: "people?page={args.page}&search={args.query}") {
        count
        next
        previous
        results @type(name: "People") {
            name
            hair_color
            skin_color
            eye_color
            birth_year
            gender
            url
        }
    }
}
`;
interface IPeople {
    id: string;
    name: string;
    hair_color: string;
    skin_color: string;
    eye_color: string;
    birth_year: string;
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

interface IFilterValues {
    query: string;
}
interface IVariables extends IFilterValues {
    query: string;
    page: number;
}

function Story() {
    const filterApi = useTableQueryFilter<IFilterValues>({ query: "" });

    const pagingApi = useTableQueryPaging(1);

    const tableQuery = useTableQuery<IQueryData, IVariables>()(query, {
        variables: {
            ...filterApi.current,
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
        return {
            ...filterApi.current,
            page,
        };
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
                            },
                            {
                                name: "hair_color",
                                header: "Hair color",
                            },
                            {
                                name: "skin_color",
                                header: "Skin color",
                            },
                            {
                                name: "eye_color",
                                header: "Eye color",
                            },
                            {
                                name: "birth_year",
                                header: "Birth year",
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
    .add("Table Paging Filter Excel Export", () => <Story />);
