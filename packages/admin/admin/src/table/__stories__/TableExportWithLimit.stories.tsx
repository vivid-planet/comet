import { gql } from "@apollo/client";
import { Typography } from "@mui/material";

import type { Product } from "../../../.storybook/mocks/handlers";
import { FillSpace } from "../../common/FillSpace";
import { MainContent } from "../../common/MainContent";
import { ToolbarActions } from "../../common/toolbar/actions/ToolbarActions";
import { ToolbarItem } from "../../common/toolbar/item/ToolbarItem";
import { Toolbar } from "../../common/toolbar/Toolbar";
import { useExportDisplayedTableData } from "../excelexport/useExportDisplayedTableData";
import { useExportTableQuery } from "../excelexport/useExportTableQuery";
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

export const ExportWithLimit = () => {
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

    const exportCurrentPageApi = useExportDisplayedTableData({ fileName: "Custom File Name Displayed Data" });
    const exportApi = useExportTableQuery<IVariables>(api, { offset: 0, limit: 10 }, { fileName: "Custom File Name Limit 10" });

    return (
        <TableQuery api={api} loading={loading} error={error}>
            {tableData && (
                <>
                    <Toolbar>
                        <ToolbarItem>
                            <Typography variant="h3">Export Visibility With Limit</Typography>
                        </ToolbarItem>
                        <FillSpace />
                        <ToolbarActions>
                            <ExcelExportButton exportApi={exportCurrentPageApi}>Aktuelle Seite exportieren</ExcelExportButton>
                            <ExcelExportButton exportApi={exportApi}>Export All (max. 10 Rows)</ExcelExportButton>
                        </ToolbarActions>
                    </Toolbar>

                    <MainContent>
                        <Table
                            exportApis={[exportCurrentPageApi, exportApi]}
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
