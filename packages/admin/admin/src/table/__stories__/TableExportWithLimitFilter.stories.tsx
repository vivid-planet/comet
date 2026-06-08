import { gql } from "@apollo/client";
import { Typography } from "@mui/material";

import type { Product } from "../../../.storybook/mocks/handlers";
import { FillSpace } from "../../common/FillSpace";
import { MainContent } from "../../common/MainContent";
import { ToolbarActions } from "../../common/toolbar/actions/ToolbarActions";
import { ToolbarItem } from "../../common/toolbar/item/ToolbarItem";
import { Toolbar } from "../../common/toolbar/Toolbar";
import { Field } from "../../form/Field";
import { FinalFormInput } from "../../form/FinalFormInput";
import { useExportDisplayedTableData } from "../excelexport/useExportDisplayedTableData";
import { useExportTableQuery } from "../excelexport/useExportTableQuery";
import { ExcelExportButton } from "../ExcelExportButton";
import { createOffsetLimitPagingAction } from "../paging/createOffsetLimitPagingAction";
import { Table, VisibleType } from "../Table";
import { TableFilterFinalForm } from "../TableFilterFinalForm";
import { TableQuery } from "../TableQuery";
import { useTableQuery } from "../useTableQuery";
import { useTableQueryFilter } from "../useTableQueryFilter";
import { useTableQueryPaging } from "../useTableQueryPaging";

interface IQueryData {
    products: { nodes: Product[]; totalCount: number };
}

interface IFilterValues {
    search: string;
}

interface IVariables extends IFilterValues {
    offset: number;
    limit: number;
}

export default {
    title: "@comet/admin/table",
};

export const ExportWithLimitFilter = () => {
    const loadLimit = 3;
    const pagingApi = useTableQueryPaging(0);
    const filterApi = useTableQueryFilter<IFilterValues>({ search: "" });

    const { tableData, api, loading, error } = useTableQuery<IQueryData, IVariables>()(
        gql`
            query products($search: String, $offset: Int, $limit: Int) {
                products(search: $search, offset: $offset, limit: $limit) {
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
                ...filterApi.current,
                limit: loadLimit,
            },
            resolveTableData: (data) => ({
                data: data.products.nodes,
                totalCount: data.products.totalCount,
                pagingInfo: createOffsetLimitPagingAction(pagingApi, { totalCount: data.products.totalCount }, loadLimit),
            }),
        },
    );

    const exportCurrentPageApi = useExportDisplayedTableData();
    const exportApi = useExportTableQuery<IVariables>(api, { ...filterApi.current, offset: 0, limit: 10 });

    return (
        <TableQuery api={api} loading={loading} error={error}>
            <>
                <Toolbar>
                    <ToolbarItem>
                        <Typography variant="h3">Export Visibility With LimitFilter</Typography>
                    </ToolbarItem>
                    <ToolbarItem>
                        <TableFilterFinalForm filterApi={filterApi}>
                            <Field name="search" type="text" component={FinalFormInput} fullWidth />
                        </TableFilterFinalForm>
                    </ToolbarItem>
                    <FillSpace />
                    <ToolbarActions>
                        <ExcelExportButton exportApi={exportCurrentPageApi}>Aktuelle Seite exportieren</ExcelExportButton>
                        <ExcelExportButton exportApi={exportApi}>Export All (max. 10 Rows)</ExcelExportButton>
                    </ToolbarActions>
                </Toolbar>
                <MainContent>
                    {tableData && (
                        <Table
                            exportApis={[exportCurrentPageApi, exportApi]}
                            {...tableData}
                            columns={[
                                {
                                    name: "name",
                                    visible: { [VisibleType.Browser]: true },
                                    header: "Name",
                                    sortable: true,
                                },
                            ]}
                        />
                    )}
                </MainContent>
            </>
        </TableQuery>
    );
};
