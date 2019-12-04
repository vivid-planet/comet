import { storiesOf } from "@storybook/react";
import { ExcelExportButton, IRow, Table, useExportDisplayedTableData, VisibleType } from "@vivid-planet/react-admin-core";
import * as React from "react";

interface IExampleRow extends IRow {
    id: number;
    column1: string | number | null;
    column2: string | number | null;
    column3: string | number | null;
    column4: string | number | null;
    column5: string | number | null;
}

function Story() {
    const data: IExampleRow[] = [
        { id: 1, column1: 1, column2: 2, column3: 3, column4: 4, column5: 5 },
        { id: 2, column1: 1, column2: 2, column3: 3, column4: 4, column5: 5 },
        { id: 3, column1: 1, column2: 2, column3: 3, column4: 4, column5: 5 },
        { id: 4, column1: 1, column2: 2, column3: 3, column4: 4, column5: 5 },
        { id: 5, column1: 1, column2: 2, column3: 3, column4: 4, column5: 5 },
    ];
    const exportApi = useExportDisplayedTableData<IExampleRow>({ fileName: "Custom File Name", worksheetName: "Custom Worksheet Name" });

    /*
     * Browser: Show columns 1 and 5
     * Export: Show columns 1, 3 and 4
     * */
    return (
        <>
            <ExcelExportButton exportApi={exportApi} />
            <Table
                exportApis={[exportApi]}
                data={data}
                totalCount={data.length}
                columns={[
                    {
                        name: "column1",
                        header: "Column 1", // Default visibility: is true for browser and export
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
        </>
    );
}

storiesOf("react-admin-core", module).add("Table Export Visibility", () => <Story />);
