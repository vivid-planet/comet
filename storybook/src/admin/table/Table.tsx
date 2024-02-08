import { Table } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";

interface IExampleRow {
    id: number;
    foo1: string;
    foo2: string;
    nestedFoo: {
        foo: string;
    };
}

function Story() {
    const data: IExampleRow[] = [
        { id: 1, foo1: "blub", foo2: "blub", nestedFoo: { foo: "bar" } },
        { id: 2, foo1: "blub", foo2: "blub", nestedFoo: { foo: "bar" } },
        { id: 3, foo1: "blub", foo2: "blub", nestedFoo: { foo: "bar" } },
        { id: 4, foo1: "blub", foo2: "blub", nestedFoo: { foo: "bar" } },
    ];

    return (
        <Table
            data={data}
            totalCount={data.length}
            columns={[
                {
                    name: "foo1",
                    header: "Foo1",
                },
                {
                    name: "foo2",
                    header: "Foo2",
                    render: (row) => <strong>{row.id}</strong>,
                },
                {
                    name: "bar",
                    visible: false,
                },
                {
                    name: "nestedFoo.foo",
                    header: "Nested foo",
                },
            ]}
        />
    );
}

storiesOf("@comet/admin/table", module).add("Table", () => <Story />);
