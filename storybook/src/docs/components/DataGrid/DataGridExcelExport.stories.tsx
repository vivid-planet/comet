import { gql, useQuery } from "@apollo/client";
import {
    Button,
    FileIcon,
    FillSpace,
    GridColDef,
    Loading,
    Toolbar,
    ToolbarActions,
    useBufferedRowCount,
    useDataGridExcelExport,
    useDataGridRemote,
} from "@comet/admin";
import { MoreVertical } from "@comet/admin-icons";
import { Menu, MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import type { Meta, StoryFn } from "@storybook/react";
import { useRef, useState } from "react";

import { apolloStoryDecorator } from "../../../apollo-story.decorator";
import { storyRouterDecorator } from "../../../story-router.decorator";

type Story = StoryFn;
const config: Meta = {
    title: "Docs/Components/DataGrid/DataGridExcelExport",
    decorators: [storyRouterDecorator(), apolloStoryDecorator("/graphql")],
};
export default config;

type Launch = {
    id: string;
    mission_name: string;
};

interface LaunchesPastResultData {
    data: Launch[];
    result: { totalCount: number };
}

interface GQLQueryVariables {
    offset: number;
    limit: number;
    sort?: string;
    order?: string | null;
}

interface GQLQuery {
    __typename?: "Query";
    launchesPastResult: LaunchesPastResultData;
}

type ExcelLaunch = {
    id: string;
    mission_name: string;
    launch_date_local: Date;
};

interface ExcelLaunchesPastResultData {
    data: ExcelLaunch[];
    result: { totalCount: number };
}

interface GQLExcelQueryVariables {
    offset: number;
    limit: number;
    sort?: string;
    order?: string | null;
}

interface GQLExcelQuery {
    __typename?: "Query";
    launchesPastResult: ExcelLaunchesPastResultData;
}

/**
 * This story shows how to use the `useDataGridExcelExport` hook to export data from a DataGrid, where the data
 * for the excel is fetched independently (with more columns) than the data for the DataGrid.
 */
const TemplateStory: Story = (props) => {
    const Story = () => {
        const dataGridProps = useDataGridRemote();

        const variables = {
            limit: dataGridProps.pageSize,
            offset: dataGridProps.page * dataGridProps.pageSize,
            sort: dataGridProps.sortModel[0]?.field,
            order: dataGridProps.sortModel[0]?.sort,
        };

        const columns: GridColDef[] = [
            {
                field: "mission_name",
                headerName: "Mission Name",
            },
        ];

        const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);
        const moreMenuRef = useRef<HTMLButtonElement>(null);

        const query = gql`
            query LaunchesPast($limit: Int, $offset: Int, $sort: String, $order: String) {
                launchesPastResult(limit: $limit, offset: $offset, sort: $sort, order: $order) {
                    data {
                        id
                        mission_name
                    }
                    result {
                        totalCount
                    }
                }
            }
        `;

        const { data, loading, error } = useQuery<GQLQuery, GQLQueryVariables | undefined>(query, {
            variables,
        });

        const exportApi = useDataGridExcelExport<ExcelLaunch, GQLExcelQuery, GQLExcelQueryVariables>({
            columns: [
                {
                    field: "mission_name",
                    headerName: "Mission Name",
                },
                {
                    field: "launch_date_local",
                    headerName: "Launch Date",
                    type: "dateTime",
                },
            ],
            variables,
            query: gql`
                query LaunchesPastExcel($limit: Int, $offset: Int, $sort: String, $order: String) {
                    launchesPastResult(limit: $limit, offset: $offset, sort: $sort, order: $order) {
                        data {
                            id
                            mission_name
                            launch_date_local
                        }
                        result {
                            totalCount
                        }
                    }
                }
            `,
            resolveQueryNodes: (data) => data.launchesPastResult.data,
            totalCount: data?.launchesPastResult.result.totalCount ?? 0,
            exportOptions: {
                fileName: "ExampleName",
            },
        });

        function DemoToolbar() {
            return (
                <Toolbar>
                    <FillSpace />
                    <ToolbarActions>
                        <>
                            <Button variant="textDark" ref={moreMenuRef} onClick={() => setShowMoreMenu(true)} endIcon={<MoreVertical />}>
                                More Actions
                            </Button>
                            <Menu
                                anchorEl={moreMenuRef.current}
                                open={showMoreMenu}
                                onClose={() => setShowMoreMenu(false)}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                }}
                            >
                                <MenuItem
                                    onClick={() => {
                                        exportApi.exportGrid();
                                        setShowMoreMenu(false);
                                    }}
                                    disabled={exportApi.loading}
                                    sx={{ display: "flex", gap: "10px" }}
                                >
                                    {exportApi.loading ? <Loading fontSize="small" /> : <FileIcon fileType="application/msexcel" />}
                                    Export
                                </MenuItem>
                            </Menu>
                        </>
                    </ToolbarActions>
                </Toolbar>
            );
        }

        const rows = data?.launchesPastResult.data ?? [];
        const rowCount = useBufferedRowCount(data?.launchesPastResult.result.totalCount);

        return (
            <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid
                    {...dataGridProps}
                    rows={rows}
                    columns={columns}
                    rowCount={rowCount}
                    loading={loading}
                    error={error}
                    components={{
                        Toolbar: DemoToolbar,
                    }}
                />
            </Box>
        );
    };

    return <Story />;
};

export const DataGridExcelExportStory: Story = TemplateStory.bind({}) as Story;
DataGridExcelExportStory.storyName = "DataGridExcelExport";
