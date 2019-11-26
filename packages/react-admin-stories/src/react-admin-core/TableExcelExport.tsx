import { storiesOf } from "@storybook/react";
import { ExcelExportButton, IRow, Table, useTableCurrentPageExportExcel } from "@vivid-planet/react-admin-core";
import * as React from "react";

interface IExampleRow extends IRow {
    id: number;
    foo1: string | number | null;
    foo2: string;

    nestedFoo: {
        foo: string;
    };
}

const CustomHeader: React.FunctionComponent = () => {
    return <div>Custom Header</div>;
};

function Story() {
    const data: IExampleRow[] = [
        { id: 1, foo1: "blub", foo2: "blub", nestedFoo: { foo: "bar" } },
        { id: 2, foo1: "blub", foo2: "blub", nestedFoo: { foo: "bar" } },
        { id: 3, foo1: 1, foo2: "blub", nestedFoo: { foo: "bar" } },
        { id: 4, foo1: null, foo2: "blub", nestedFoo: { foo: "bar" } },
        { id: 5, foo1: 32, foo2: "blub", nestedFoo: { foo: "bar" } },
    ];
    const exportExcelApi = useTableCurrentPageExportExcel<IExampleRow>();

    return (
        <>
            <ExcelExportButton exportApi={exportExcelApi} />
            <Table
                exportExcelApi={exportExcelApi}
                data={data}
                totalCount={data.length}
                columns={[
                    {
                        name: "foo1",
                        header: "Foo1", // if header is a string -> excel export can export header
                    },
                    {
                        name: "foo2",
                        header: "Expo",
                        render: row => <strong>{row.id}</strong>,
                        renderExcel: row => row.id.toString(), // HTML Nodes / React Nodes (from above render) can not be exported to excel -> use renderExcel to generate an exportable string
                    },
                    {
                        name: "bar",
                        visible: false, // hidden columns will be exported hidden
                    },
                    {
                        name: "nestedFoo.foo",
                        header: "Nested foo",
                    },
                    {
                        name: "customheader",
                        header: <CustomHeader>Custom Header</CustomHeader>,
                        headerExcel: "Overrided Excel Export Header", // HTML Nodes / React Nodes (from above header) can not be exported to excel -> use headerExcel to set an exportable column header
                        render: row => "Custom Row Content", // if render returns a string -> excel export can export this string
                    },
                    {
                        name: "customheader",
                        header: <CustomHeader>Custom Header</CustomHeader>,
                        headerExcel: "Overrided Excel Export Header", // HTML Nodes / React Nodes (from above header) can not be exported to excel -> use headerExcel to set an exportable column header
                        render: row => "Custom Row Content", // if render returns a string -> excel export can export this string
                    },
                ]}
            />
        </>
    );
}

storiesOf("react-admin-core", module).add("Table Excel Export", () => <Story />);
