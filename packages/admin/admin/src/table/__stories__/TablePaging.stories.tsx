import { gql } from "@apollo/client";

import { MainContent } from "../../common/MainContent";
import { createPagePagingActions } from "../paging/createPagePagingActions";
import { Table } from "../Table";
import { TableQuery } from "../TableQuery";
import { useTableQuery } from "../useTableQuery";
import { useTableQueryPaging } from "../useTableQueryPaging";

type UsersWithPagingResult = {
    nodes: { id: number; name: string; username: string; email: string }[];
    totalCount: number;
    nextPage?: number;
    previousPage?: number;
    totalPages?: number;
};

export default {
    title: "@comet/admin/table",
};

export const Paging = () => {
    const pagingApi = useTableQueryPaging(1);
    const { tableData, api, loading, error } = useTableQuery<{ usersWithPaging: UsersWithPagingResult }, { page?: number; size?: number }>()(
        gql`
            query UsersWithPaging($page: Int, $size: Int) {
                usersWithPaging(page: $page, size: $size) {
                    nodes {
                        id
                        name
                        username
                        email
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
                size: 3,
            },
            resolveTableData: (data) => {
                return {
                    data: data.usersWithPaging.nodes,
                    totalCount: data.usersWithPaging.totalCount,
                    pagingInfo: createPagePagingActions(pagingApi, {
                        totalPages: data.usersWithPaging.totalPages,
                        nextPage: data.usersWithPaging.nextPage ?? null,
                        previousPage: data.usersWithPaging.previousPage ?? null,
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
                                name: "name",
                                header: "Name",
                            },
                            {
                                name: "username",
                                header: "Username",
                            },
                        ]}
                    />
                )}
            </MainContent>
        </TableQuery>
    );
};
