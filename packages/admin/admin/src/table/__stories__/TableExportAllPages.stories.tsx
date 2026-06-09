import { gql } from "@apollo/client";
import { Typography } from "@mui/material";

import type { Photo } from "../../../.storybook/mocks/handlers";
import { FillSpace } from "../../common/FillSpace";
import { MainContent } from "../../common/MainContent";
import { ToolbarActions } from "../../common/toolbar/actions/ToolbarActions";
import { ToolbarItem } from "../../common/toolbar/item/ToolbarItem";
import { Toolbar } from "../../common/toolbar/Toolbar";
import { useExportPagedTableQuery } from "../excelexport/useExportPagedTableQuery";
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

export const ExportAllPages = () => {
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

    const exportApi = useExportPagedTableQuery<IVariables>(api, {
        fromPage: 0,
        toPage: totalCount / loadLimit,
        variablesForPage: (page) => {
            return {
                start: page * loadLimit,
                limit: loadLimit,
            };
        },
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
