import { EditDialog, IEditDialogApi, Table, Toolbar, ToolbarFillSpace, ToolbarItem } from "@comet/admin";
import { Button, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { useLocation } from "react-router";

import { editDialogDecorator } from "../editDialog.decorator";

interface User {
    id: string;
    name: string;
}

const users: User[] = [
    { id: "8a31ea9d-d00a-4e37-807b-a69624964ba0", name: "Isabella" },
    { id: "a5baf49a-d53c-4b3f-abd4-80d2b418589d", name: "Theo" },
    { id: "29734826-06b4-491b-ada7-cf1000d95790", name: "Maria" },
];

storiesOf("stories/components/EditDialog/Edit Dialog and Selection (EditDialog Component) docs only", module)
    .addDecorator(editDialogDecorator())
    .add("Edit Dialog and Selection (EditDialog Component)", () => {
        const location = useLocation();
        const editDialogApi = React.useRef<IEditDialogApi>(null);

        return (
            <>
                <h2>Click on a button to see the current selection values:</h2>
                <Toolbar>
                    <ToolbarFillSpace />
                    <ToolbarItem>
                        <Button onClick={() => editDialogApi.current?.openAddDialog()} variant="contained" color="primary">
                            Add User
                        </Button>
                    </ToolbarItem>
                </Toolbar>
                <Table
                    data={users}
                    totalCount={users.length}
                    columns={[
                        { name: "name", header: "Name" },
                        {
                            name: "edit",
                            cellProps: {
                                align: "right",
                            },
                            render: (row) => {
                                return (
                                    <Button
                                        onClick={() => {
                                            editDialogApi.current?.openEditDialog(row.id);
                                        }}
                                    >
                                        Change Name
                                    </Button>
                                );
                            },
                        },
                    ]}
                />
                <EditDialog ref={editDialogApi}>
                    {({ selectionMode, selectedId }) => {
                        return (
                            <>
                                <Typography>
                                    <strong>Mode:</strong> {selectionMode}
                                </Typography>

                                <Typography>
                                    <strong>ID:</strong> {selectedId}
                                </Typography>

                                <Typography>
                                    <strong>URL:</strong> {location.pathname}
                                </Typography>
                            </>
                        );
                    }}
                </EditDialog>
            </>
        );
    });
