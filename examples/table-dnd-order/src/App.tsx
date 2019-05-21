import { Button } from "@material-ui/core";
import { TableColumn as Column, TableDndOrder, TableLocalChanges } from "@vivid-planet/react-admin-core";
import * as React from "react";

interface IRow {
    id: string; // TODO add support for number in TableLocalChanges
    pos: number;
    foo1: string;
    foo2: string;
}
export default function App() {
    const data: IRow[] = [{ id: "1", pos: 1, foo1: "blub", foo2: "blub" }, { id: "2", pos: 2, foo1: "blub", foo2: "blub" }];
    return (
        <TableLocalChanges
            data={data}
            onSubmit={async changes => {
                alert(JSON.stringify(changes));
            }}
        >
            {({ tableLocalChangesApi, data: changedData }) => (
                <>
                    <TableDndOrder data={changedData} totalCount={changedData.length} sort="foo1" order="asc" moveRow={tableLocalChangesApi.moveRow}>
                        <Column name="foo1" header="Foo1" />
                        <Column name="foo2" header="Foo2">
                            {row => <strong>{row.foo2}</strong>}
                        </Column>
                    </TableDndOrder>
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
