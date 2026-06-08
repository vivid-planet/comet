import { gql } from "@apollo/client";
import { Typography } from "@mui/material";

import type { Product } from "../../../.storybook/mocks/handlers";
import { FillSpace } from "../../common/FillSpace";
import { MainContent } from "../../common/MainContent";
import { ToolbarActions } from "../../common/toolbar/actions/ToolbarActions";
import { ToolbarItem } from "../../common/toolbar/item/ToolbarItem";
import { Toolbar } from "../../common/toolbar/Toolbar";
import { useExportPagedTableQuery } from "../excelexport/useExportPagedTableQuery";
import { ExcelExportButton } from "../ExcelExportButton";
import { createOffsetLimitPagingAction } from "../paging/createOffsetLimitPagingAction";
import { Table } from "../Table";
import { TableQuery } from "../TableQuery";
import { useTableQuery } from "../useTableQuery";
import { useTableQueryPaging } from "../useTableQueryPaging";

interface IQueryData {
    products: { nodes: Product[]; totalCount: number };
}

interface IVariables {
    offset: number;
    limit: number;
}

export default {
    title: "@comet/admin/table",
};

export const ExportAllPages = () => {
    const loadLimit = 3;
    const pagingApi = useTableQueryPaging(0);

    const { tableData, api, loading, error } = useTableQuery<IQueryData, IVariables>()(
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
                limit: loadLimit,
            },
            resolveTableData: (data) => ({
                data: data.products.nodes,
                totalCount: data.products.totalCount,
                pagingInfo: createOffsetLimitPagingAction(pagingApi, { totalCount: data.products.totalCount }, loadLimit),
            }),
        },
    );

    const exportApi = useExportPagedTableQuery<IVariables>(api, {
        fromPage: 0,
        toPage: tableData ? Math.ceil(tableData.totalCount / loadLimit) : 0,
        variablesForPage: (page) => ({
            offset: page * loadLimit,
            limit: loadLimit,
        }),
    });

    return (
        <TableQuery api={api} loading={loading} error={error}>
            {tableData && (
                <>
                    <Toolbar>
                        <ToolbarItem>
                            <Typography variant="h3">Export All Pages</Typography>
                        </ToolbarItem>
                        <FillSpace />
                        <ToolbarActions>
                            <ExcelExportButton exportApi={exportApi} />
                        </ToolbarActions>
                    </Toolbar>
                    <MainContent>
                        <Table
                            exportApis={[exportApi]}
                            {...tableData}
                            columns={[
                                {
                                    name: "name",
                                    header: "Name",
                                    sortable: true,
                                },
                            ]}
                        />
                    </MainContent>
                </>
            )}
        </TableQuery>
    );
};
