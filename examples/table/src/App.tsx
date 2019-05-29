import { Table } from "@vivid-planet/react-admin-core";
import * as React from "react";

interface IExampleRow {
    id: number;
    foo1: string;
    foo2: string;
}
export default function App() {
    const data: IExampleRow[] = [{ id: 1, foo1: "blub", foo2: "blub" }, { id: 2, foo1: "blub", foo2: "blub" }];
    return (
        <Table
            data={data}
            totalCount={data.length}
            sort="foo1"
            order="asc"
            columns={[
                {
                    name: "foo1",
                    header: "Foo1",
                },
                {
                    name: "foo2",
                    header: "Foo2",
                    render: row => <strong>{row.id}</strong>,
                },
                {
                    name: "bar",
                    visible: false,
                },
            ]}
        />
    );
}
