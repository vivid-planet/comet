import { Stack as MuiStack } from "@mui/material";
import type { Decorator } from "@storybook/react-vite";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Button } from "../../common/buttons/Button";
import { StackPage } from "../../stack/Page";
import { Stack } from "../../stack/Stack";
import { StackLink } from "../../stack/StackLink";
import { StackSwitch } from "../../stack/Switch";
import { TableDndOrder } from "../TableDndOrder";
import { TableLocalChanges } from "../TableLocalChanges";

const dndProviderDecorator: Decorator = (Story) => (
    <DndProvider backend={HTML5Backend}>
        <Story />
    </DndProvider>
);

interface IRow {
    id: string;
    order: number;
    task: string;
}

export default {
    title: "admin/table",
    decorators: [dndProviderDecorator],
};

export const DnDOrder = {
    render: () => {
        const data: IRow[] = [
            { id: "1", order: 1, task: "Write a cool JS library" },
            { id: "2", order: 2, task: "Make it generic enough" },
            { id: "3", order: 3, task: "Write README" },
            { id: "4", order: 4, task: "Create some examples" },
            { id: "5", order: 5, task: "PROFIT" },
        ];

        return (
            <Stack topLevelTitle="Stack">
                <StackSwitch>
                    <StackPage name="page-1">
                        <TableLocalChanges
                            data={data}
                            onSubmit={async (changes) => {
                                alert(JSON.stringify(changes));
                            }}
                            orderColumn="order"
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
                                    <MuiStack direction="row" gap={2} sx={{ mt: 2, alignItems: "center" }}>
                                        <Button
                                            onClick={() => {
                                                tableLocalChangesApi.submitLocalDataChanges();
                                            }}
                                        >
                                            Submit
                                        </Button>
                                        <StackLink pageName="page-2" payload="any">
                                            To page 2
                                        </StackLink>
                                    </MuiStack>
                                </>
                            )}
                        </TableLocalChanges>
                    </StackPage>
                    <StackPage name="page-2">Page 2</StackPage>
                </StackSwitch>
            </Stack>
        );
    },

    name: "DnD Order",
};
