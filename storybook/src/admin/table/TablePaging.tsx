import { gql } from "@apollo/client";
import { createPagePagingActions, MainContent, Table, TableQuery, useTableQuery, useTableQueryPaging } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { LaunchesPastPagePagingResult } from "../../../.storybook/mocks/handlers";
import { apolloStoryDecorator } from "../../apollo-story.decorator";

function Story() {
    const pagingApi = useTableQueryPaging(1);
    const { tableData, api, loading, error } = useTableQuery<
        { launchesPastPagePaging: LaunchesPastPagePagingResult },
        { page?: number; size?: number }
    >()(
        gql`
            query LaunchesPastPagePaging($page: Int, $size: Int) {
                launchesPastPagePaging(page: $page, size: $size) {
                    nodes {
                        id
                        mission_name
                        launch_date_local
                    }
                    totalCount
                    nextPage
                    previousPage
                    totalPages
                }
            }
        `,
        {
            variables: {
                page: pagingApi.current,
            },
            resolveTableData: (data) => {
                console.log("data ", data);

                return {
                    data: data.launchesPastPagePaging.nodes,
                    totalCount: data.launchesPastPagePaging.totalCount,
                    pagingInfo: createPagePagingActions(pagingApi, {
                        totalPages: data.launchesPastPagePaging.totalPages,
                        nextPage: data.launchesPastPagePaging.nextPage ?? null,
                        previousPage: data.launchesPastPagePaging.previousPage ?? null,
                    }),
                };
            },
            notifyOnNetworkStatusChange: true,
        },
    );

    return (
        <TableQuery api={api} loading={loading} error={error}>
            <MainContent>
                {tableData && (
                    <Table
                        {...tableData}
                        columns={[
                            {
                                name: "mission_name",
                                header: "Mission Name",
                            },
                        ]}
                    />
                )}
            </MainContent>
        </TableQuery>
    );
}

storiesOf("@comet/admin/table", module)
    .addDecorator(apolloStoryDecorator("/graphql"))
    .add("Paging", () => <Story />);
