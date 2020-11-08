import { storiesOf } from "@storybook/react";
import { createRestPagingActions, Table, TableQuery, useTableQuery, useTableQueryPaging } from "@vivid-planet/react-admin-core";
import gql from "graphql-tag";
import * as React from "react";
import { apolloStoryDecorator } from "../apollo-story.decorator";

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

interface IQueryData {
    people: {
        count: number;
        next: string;
        previous: string;
        results: Array<{
            name: string;
            url: string;
        }>;
    };
}

interface IVariables {
    page: number;
}

function Story() {
    const pagingApi = useTableQueryPaging(1);
    const { tableData, api, loading, error } = useTableQuery<IQueryData, IVariables>()(query, {
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

    return (
        <TableQuery api={api} loading={loading} error={error}>
            {tableData && (
                <Table
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
    );
}

storiesOf("react-admin-core", module)
    .addDecorator(
        apolloStoryDecorator({
            uri: "https://swapi.co/api/",
        }),
    )
    .add("Table Paging", () => <Story />);
