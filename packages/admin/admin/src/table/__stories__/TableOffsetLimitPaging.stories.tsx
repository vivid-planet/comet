import { gql } from "@apollo/client";

import type { Product } from "../../../.storybook/mocks/handlers";
import { MainContent } from "../../common/MainContent";
import { createOffsetLimitPagingAction } from "../paging/createOffsetLimitPagingAction";
import { Table } from "../Table";
import { TableQuery } from "../TableQuery";
import { useTableQuery } from "../useTableQuery";
import { useTableQueryPaging } from "../useTableQueryPaging";

export default {
    title: "@comet/admin/table",
};

export const PagingOffsetLimit = () => {
    const pagingApi = useTableQueryPaging(0);
    const limit = 3;
    const { tableData, api, loading, error } = useTableQuery<
        { products: { nodes: Product[]; totalCount: number } },
        { offset: number; limit: number }
    >()(
        gql`
            query products($offset: Int, $limit: Int) {
                products(offset: $offset, limit: $limit) {
                    nodes {
                        id
                        name
                    }
                    totalCount
                }
            }
        `,
        {
            variables: {
                offset: pagingApi.current,
                limit,
            },
            resolveTableData: (data) => {
                return {
                    data: data?.products?.nodes,
                    totalCount: data?.products?.totalCount,
                    pagingInfo: createOffsetLimitPagingAction(pagingApi, { totalCount: data?.products?.totalCount }, limit),
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
                        ]}
                    />
                )}
            </MainContent>
        </TableQuery>
    );
};
