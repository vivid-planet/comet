import { gql } from "@apollo/client";
import { Typography } from "@mui/material";

import type { Photo } from "../../../.storybook/mocks/handlers";
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
import { createRestStartLimitPagingActions } from "../paging/createRestStartLimitPagingActions";
import { Table, VisibleType } from "../Table";
import { TableFilterFinalForm } from "../TableFilterFinalForm";
import { TableQuery } from "../TableQuery";
import { useTableQuery } from "../useTableQuery";
import { useTableQueryFilter } from "../useTableQueryFilter";
import { useTableQueryPaging } from "../useTableQueryPaging";

const query = gql`
    query photos($query: String, $start: Int, $limit: Int) {
        photos(query: $query, start: $start, limit: $limit) {
            id
            albumId
            title
            thumbnailUrl
        }
    }
`;

interface IQueryData {
    photos: Photo[];
}

interface IFilterValues {
    query: string;
}
interface IVariables extends IFilterValues {
    start: number;
    limit: number;
}

export default {
    title: "admin/table",
};

export const ExportWithLimitFilter = () => {
    const totalCount = 5000;
    const loadLimit = 50;
    const pagingApi = useTableQueryPaging(0);

    const filterApi = useTableQueryFilter<IFilterValues>({ query: "" });

    const { tableData, api, loading, error } = useTableQuery<IQueryData, IVariables>()(query, {
        variables: {
            start: pagingApi.current,
            ...filterApi.current,
            limit: loadLimit,
        },
        resolveTableData: (data) => ({
            data: data.photos,
            totalCount,
            pagingInfo: createRestStartLimitPagingActions(pagingApi, {
                totalPages: Math.ceil(totalCount / loadLimit),
                loadLimit,
            }),
        }),
    });

    const exportCurrentPageApi = useExportDisplayedTableData();
    const exportApi = useExportTableQuery<IVariables>(api, { ...filterApi.current, start: 0, limit: 5000 });

    return (
        <TableQuery api={api} loading={loading} error={error}>
            <>
                <Toolbar>
                    <ToolbarItem>
                        <Typography variant="h3">Export Visibility With LimitFilter</Typography>
                    </ToolbarItem>
                    <ToolbarItem>
                        <TableFilterFinalForm filterApi={filterApi}>
                            <Field name="query" type="text" component={FinalFormInput} fullWidth />
                        </TableFilterFinalForm>
                    </ToolbarItem>
                    <FillSpace />
                    <ToolbarActions>
                        <ExcelExportButton exportApi={exportCurrentPageApi}>Aktuelle Seite exportieren</ExcelExportButton>
                        <ExcelExportButton exportApi={exportApi}>Export All (max. 5000 Rows)</ExcelExportButton>
                    </ToolbarActions>
                </Toolbar>
                <MainContent>
                    {tableData && (
                        <Table
                            exportApis={[exportCurrentPageApi, exportApi]}
                            {...tableData}
                            columns={[
                                {
                                    name: "thumbnailUrl",
                                    header: "Thumbnail",
                                    sortable: true,
                                    visible: { [VisibleType.Browser]: false, [VisibleType.Export]: false },
                                    render: (row: Photo) => {
                                        return <img src={row.thumbnailUrl} />;
                                    },
                                    headerExcel: "Thumbnail Url",
                                    renderExcel: (row: Photo) => {
                                        return row.thumbnailUrl;
                                    },
                                },
                                {
                                    name: "title",
                                    visible: { [VisibleType.Browser]: true },
                                    header: "Title",
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
