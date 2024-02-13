import { TableDndOrder, TableLocalChanges } from "@comet/admin";
import { Button } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { dndProviderDecorator } from "../../dnd.decorator";

interface IRow {
    id: string; // TODO add support for number in TableLocalChanges
    order: number;
    task: string;
}

function Story() {
    const data: IRow[] = [
        { id: "1", order: 1, task: "Write a cool JS library" },
        { id: "2", order: 2, task: "Make it generic enough" },
        { id: "3", order: 3, task: "Write README" },
        { id: "4", order: 4, task: "Create some examples" },
        { id: "5", order: 5, task: "PROFIT" },
    ];

    return (
        <TableLocalChanges
            data={data}
            onSubmit={async (changes) => {
                alert(JSON.stringify(changes));
            }}
            orderColumn="order" // if anything but 'pos' is used
        >
            {({ tableLocalChangesApi, data: changedData }) => (
                <>
                    <TableDndOrder
                        data={changedData}
                        totalCount={changedData.length}
                        moveRow={tableLocalChangesApi.moveRow}
                        onDragEnd={() => {
                            // alternative to submit button
                            // tableLocalChangesApi.submitLocalDataChanges();
                        }}
                        columns={[
                            {
                                name: "task",
                                header: "Task",
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

storiesOf("@comet/admin/table", module)
    .addDecorator(dndProviderDecorator())
    .add("DnD Order", () => <Story />);
