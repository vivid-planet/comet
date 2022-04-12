import {
    ExcelExportButton,
    MainContent,
    Table,
    Toolbar,
    ToolbarActions,
    ToolbarFillSpace,
    ToolbarItem,
    useExportDisplayedTableData,
    VisibleType,
} from "@comet/admin";
import { Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

interface Person {
    id: number;
    firstname: string;
    lastname: string;
    hourlySalary?: number;
    job: {
        id: number;
        name: string;
    };
}

storiesOf("stories/components/Table/Excel Export Table", module)
    .add("Basic Excel Export Table", () => {
        const data: Person[] = [
            { id: 1, firstname: "Kady", lastname: "Wood", job: { id: 1, name: "Project Manager" } },
            { id: 2, firstname: "Lewis", lastname: "Chan", job: { id: 2, name: "UI/UX Designer" } },
            { id: 3, firstname: "Tom", lastname: "Weaver", job: { id: 3, name: "Frontend Developer" } },
            { id: 4, firstname: "Mia", lastname: "Carroll", job: { id: 4, name: "Backend Developer" } },
        ];

        // step 1
        const exportApi = useExportDisplayedTableData({ fileName: "employees.xlsx", worksheetName: "Employees" });

        return (
            <>
                <Toolbar>
                    <ToolbarItem>
                        <Typography variant={"h3"}>Basic Excel Export</Typography>
                    </ToolbarItem>
                    <ToolbarFillSpace />
                    <ToolbarActions>
                        {/* step 3 */}
                        <ExcelExportButton exportApi={exportApi} />
                    </ToolbarActions>
                </Toolbar>

                <MainContent>
                    <Table
                        // step 2
                        exportApis={[exportApi]}
                        data={data}
                        totalCount={data.length}
                        columns={[
                            {
                                name: "id",
                                header: "ID",
                            },
                            {
                                name: "firstname",
                                header: "Firstname",
                            },
                            {
                                name: "lastname",
                                header: "Lastname",
                            },
                            {
                                name: "job.name",
                                header: "Job (Nested)",
                            },
                        ]}
                    />
                </MainContent>
            </>
        );
    })
    .add("Excel Export and Visibility", () => {
        const data = [
            { id: 1, column1: 1, column2: 2, column3: 3, column4: 4, column5: 5 },
            { id: 2, column1: 1, column2: 2, column3: 3, column4: 4, column5: 5 },
            { id: 3, column1: 1, column2: 2, column3: 3, column4: 4, column5: 5 },
            { id: 4, column1: 1, column2: 2, column3: 3, column4: 4, column5: 5 },
            { id: 5, column1: 1, column2: 2, column3: 3, column4: 4, column5: 5 },
        ];

        const exportApi = useExportDisplayedTableData({ fileName: "export_visibility.xlsx", worksheetName: "Export Visibility" });

        /*
         * Browser: Show columns 1 and 5
         * Export: Show columns 1, 3 and 4
         * */
        return (
            <>
                <Toolbar>
                    <ToolbarItem>
                        <Typography variant={"h3"}>Excel Export and Visibility</Typography>
                    </ToolbarItem>
                    <ToolbarFillSpace />
                    <ToolbarActions>
                        <ExcelExportButton exportApi={exportApi} />
                    </ToolbarActions>
                </Toolbar>

                <MainContent>
                    <Table
                        exportApis={[exportApi]}
                        data={data}
                        totalCount={data.length}
                        columns={[
                            {
                                name: "column1",
                                header: "Column 1",
                                // Default visibility: is true for browser and export
                            },
                            {
                                name: "column2",
                                header: "Column 2",
                                visible: false, // explicitly set visibility to false (for browser and export)
                            },
                            {
                                name: "column3",
                                header: "Column 3",
                                visible: { [VisibleType.Browser]: false }, // column will not be shown in Browser, but will be exported
                            },
                            {
                                name: "column4",
                                header: "Column 4",
                                visible: { [VisibleType.Browser]: false, [VisibleType.Export]: true }, // column will not be shown in Browser, but will be exported
                            },
                            {
                                name: "column5",
                                header: "Column 5",
                                visible: { [VisibleType.Browser]: true, [VisibleType.Export]: false }, // column will be shown in Browser, but will not be exported
                            },
                        ]}
                    />
                </MainContent>
            </>
        );
    })
    .add("Excel Export and Custom Rendered Columns", () => {
        const data: Person[] = [
            { id: 1, firstname: "Kady", lastname: "Wood", hourlySalary: 12.3, job: { id: 1, name: "Project Manager" } },
            { id: 2, firstname: "Lewis", lastname: "Chan", hourlySalary: 15.4, job: { id: 2, name: "UI/UX Designer" } },
            { id: 3, firstname: "Tom", lastname: "Weaver", hourlySalary: 11, job: { id: 3, name: "Frontend Developer" } },
            { id: 4, firstname: "Mia", lastname: "Carroll", hourlySalary: 15.4, job: { id: 4, name: "Backend Developer" } },
        ];

        const exportApi = useExportDisplayedTableData({ fileName: "employees.xlsx", worksheetName: "Employees" });

        return (
            <>
                <Toolbar>
                    <ToolbarItem>
                        <Typography variant={"h3"}>Excel Export and Custom Rendered Columns</Typography>
                    </ToolbarItem>
                    <ToolbarFillSpace />
                    <ToolbarActions>
                        <ExcelExportButton exportApi={exportApi} />
                    </ToolbarActions>
                </Toolbar>

                <MainContent>
                    <Table
                        exportApis={[exportApi]}
                        data={data}
                        totalCount={data.length}
                        columns={[
                            {
                                name: "id",
                                header: "ID",
                            },
                            {
                                name: "name",
                                header: "Name",
                                render: (row) => (
                                    <>
                                        {row.firstname} <strong>{row.lastname}</strong>
                                    </>
                                ),
                                // if there was no renderExcel(), the exported Excel column would be empty
                                renderExcel: (row) => `${row.firstname} ${row.lastname}`,
                            },
                            {
                                name: "hourlySalary",
                                header: "Hourly Salary",
                                formatForExcel: "#,##0.00€",
                            },
                            {
                                name: "job.name",
                                header: "Job (Nested)",
                                headerExcel: "Job",
                            },
                        ]}
                    />
                </MainContent>
            </>
        );
    });
