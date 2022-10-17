import { gql } from "@apollo/client";
import { createOffsetLimitPagingAction, MainContent, Table, TableQuery, useTableQuery, useTableQueryPaging } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { apolloRestStoryDecorator } from "../../apollo-rest-story.decorator";

const query = gql`
    query Post($offset: Int, $limit: Int) {
        posts(offset: $offset, limit: $limit) @rest(type: "PostPayload", path: "posts?_start={args.offset}&_limit={args.limit}") {
            id
            title
        }
    }
`;

interface Post {
    id: string;
    title: string;
}

interface IQueryData {
    posts: Post[];
    totalCount: number;
}

interface IVariables {
    offset: number;
    limit: number;
}

function Story() {
    const pagingApi = useTableQueryPaging(0);
    const limit = 10;
    const { tableData, api, loading, error } = useTableQuery<IQueryData, IVariables>()(query, {
        variables: {
            offset: pagingApi.current,
            limit,
        },
        resolveTableData: (data) => {
            data.totalCount = 100; // Don't calculate this in a real application
            return {
                data: data.posts,
                totalCount: data.totalCount,
                pagingInfo: createOffsetLimitPagingAction(pagingApi, data, limit),
            };
        },
        notifyOnNetworkStatusChange: true,
    });

    return (
        <TableQuery api={api} loading={loading} error={error}>
            <MainContent>
                {tableData && (
                    <Table
                        {...tableData}
                        columns={[
                            {
                                name: "title",
                                header: "Title",
                            },
                        ]}
                    />
                )}
            </MainContent>
        </TableQuery>
    );
}

storiesOf("@comet/admin/table", module)
    .addDecorator(
        apolloRestStoryDecorator({
            uri: "https://swapi.co/api/",
        }),
    )
    .add("Paging Offset Limit", () => <Story />);
