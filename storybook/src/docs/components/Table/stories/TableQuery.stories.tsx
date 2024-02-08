import { gql } from "@apollo/client";
import { SortDirection, Table, TableQuery, useTableQuery } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { apolloRestStoryDecorator } from "../../../../apollo-rest-story.decorator";

const query = gql`
    query users($sort: String, $order: String) {
        users(sort: $sort, order: $order) @rest(type: "User", path: "users?_sort={args.sort}&_order={args.order}") {
            id
            name
            username
            email
        }
    }
`;

interface QueryData {
    users: Array<{
        id: number;
        name: string;
        username: string;
        email: string;
    }>;
}

interface QueryVariables {
    blubId: number;
    sort: string;
    order: SortDirection;
}

storiesOf("stories/components/Table/TableQuery", module)
    .addDecorator(apolloRestStoryDecorator())
    .add("TableQuery", () => {
        const { tableData, api, loading, error } = useTableQuery<QueryData, QueryVariables>()(query, {
            resolveTableData: (data) => ({
                data: data.users,
                totalCount: data.users.length,
            }),
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
                            {
                                name: "username",
                                header: "Username",
                            },
                            {
                                name: "email",
                                header: "E-Mail",
                            },
                        ]}
                    />
                )}
            </TableQuery>
        );
    });
