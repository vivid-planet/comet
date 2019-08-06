import { Button } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import { TableDndOrder, TableLocalChanges } from "@vivid-planet/react-admin-core";
import * as React from "react";

interface IRow {
    id: string; // TODO add support for number in TableLocalChanges
    pos: number;
    foo1: string;
    foo2: string;
}

function Story() {
    const data: IRow[] = [{ id: "1", pos: 1, foo1: "blub", foo2: "blub1" }, { id: "2", pos: 2, foo1: "blub", foo2: "blub2" }];

    return (
        <TableLocalChanges
            data={data}
            onSubmit={async changes => {
                alert(JSON.stringify(changes));
            }}
        >
            {({ tableLocalChangesApi, data: changedData }) => (
                <>
                    <TableDndOrder
                        data={changedData}
                        totalCount={changedData.length}
                        moveRow={tableLocalChangesApi.moveRow}
                        columns={[
                            {
                                name: "foo1",
                                header: "Foo1",
                            },
                            {
                                name: "foo2",
                                header: "Foo2",
                                render: row => <strong>{row.foo2}</strong>,
                            },
                        ]}
                    />
                    <Button
                        onClick={() => {
                            tableLocalChangesApi.submitLocalDataChanges();
                        }}
                    >
                        Submit
                    </Button>
                </>
            )}
        </TableLocalChanges>
    );
}

storiesOf("react-admin-core", module).add("Table DnD Order", () => <Story />);
