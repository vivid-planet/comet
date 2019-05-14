import { Table, TableColumn as Column } from "@vivid-planet/react-admin-core";
import * as React from "react";

interface IRow {
    id: number;
    foo1: string;
    foo2: string;
}
export default function App() {
    const data: IRow[] = [{ id: 1, foo1: "blub", foo2: "blub" }, { id: 2, foo1: "blub", foo2: "blub" }];
    return (
        <Table data={data} totalCount={data.length} sort="foo1" order="asc">
            <Column name="foo1" header="Foo1" />
            <Column name="foo2" header="Foo2">
                {row => <strong>{row.foo2}</strong>}
            </Column>
        </Table>
    );
}
