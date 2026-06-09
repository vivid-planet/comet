import { gql } from "@apollo/client";
import { Typography } from "@mui/material";

import type { Photo } from "../../../.storybook/mocks/handlers";
import { FillSpace } from "../../common/FillSpace";
import { MainContent } from "../../common/MainContent";
import { ToolbarActions } from "../../common/toolbar/actions/ToolbarActions";
import { ToolbarItem } from "../../common/toolbar/item/ToolbarItem";
import { Toolbar } from "../../common/toolbar/Toolbar";
import { useExportDisplayedTableData } from "../excelexport/useExportDisplayedTableData";
import { useExportTableQuery } from "../excelexport/useExportTableQuery";
import { ExcelExportButton } from "../ExcelExportButton";
import { createRestStartLimitPagingActions } from "../paging/createRestStartLimitPagingActions";
import { Table } from "../Table";
import { TableQuery } from "../TableQuery";
import { useTableQuery } from "../useTableQuery";
import { useTableQueryPaging } from "../useTableQueryPaging";

const query = gql`
    query photos($start: Int, $limit: Int) {
        photos(start: $start, limit: $limit) {
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

interface IVariables {
    start: number;
    limit: number;
}

export default {
    title: "admin/table",
};

export const ExportWithLimit = () => {
    const totalCount = 5000;
    const loadLimit = 50;
    const pagingApi = useTableQueryPaging(0);

    const { tableData, api, loading, error } = useTableQuery<IQueryData, IVariables>()(query, {
        variables: {
            start: pagingApi.current,
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

    const exportCurrentPageApi = useExportDisplayedTableData({ fileName: "Custom File Name Displayed Data" });
    const exportApi = useExportTableQuery<IVariables>(api, { start: 0, limit: 5000 }, { fileName: "Custom File Name Limit 5000" });

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
                            <ExcelExportButton exportApi={exportApi}>Export All (max. 5000 Rows)</ExcelExportButton>
                        </ToolbarActions>
                    </Toolbar>

                    <MainContent>
                        <Table
                            exportApis={[exportCurrentPageApi, exportApi]}
                            {...tableData}
                            columns={[
                                {
                                    name: "thumbnailUrl",
                                    header: "Thumbnail",
                                    sortable: true,
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
                                    header: "Title",
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
