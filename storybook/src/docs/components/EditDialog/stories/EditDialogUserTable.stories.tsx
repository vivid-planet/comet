import { Field, FinalForm, FinalFormInput, ISelectionApi, Table, Toolbar, ToolbarFillSpace, ToolbarItem, useEditDialog } from "@comet/admin";
import { Button } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { v4 as uuid } from "uuid";

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

const getUsers = (): User[] => users;
const getUser = (id: string): User | undefined => {
    return users.find((user) => user.id === id);
};
const addUser = (name: string): User[] => {
    users.push({
        id: uuid(),
        name: name,
    });
    return users;
};
const updateUser = (id: string, name: string): User => {
    const idx = users.findIndex((user) => user.id === id);

    if (idx == -1) {
        throw new Error("User doesn't exist");
    }

    users[idx].name = name;
    return users[idx];
};

interface UserFormProps {
    mode?: "add" | "edit";
    id?: string;
    selectionApi: ISelectionApi;
}

storiesOf("stories/components/EditDialog/Edit Dialog User Table", module)
    .addDecorator(editDialogDecorator())
    .add("Edit Dialog User Table", () => {
        const UserForm: React.VoidFunctionComponent<UserFormProps> = ({ selectionApi, id, mode = "add" }) => {
            const selection = { id, mode };
            const user = selection.mode === "edit" ? getUser(selection.id as string) : undefined;

            return (
                <FinalForm<{ name: string }>
                    mode={selection.mode}
                    onSubmit={async ({ name }) => {
                        if (selection.mode === "edit") {
                            updateUser(selection.id as string, name);
                        } else {
                            addUser(name);
                        }
                    }}
                    onAfterSubmit={() => {
                        selectionApi.handleDeselect();
                    }}
                    initialValues={user}
                >
                    <Field label="Name" name="name" component={FinalFormInput} fullWidth autoFocus required />
                </FinalForm>
            );
        };

        const [EditDialog, { id: selectedId, mode: selectionMode }, editDialogApi, selectionApi] = useEditDialog();
        const users = getUsers();

        return (
            <>
                <Toolbar>
                    <ToolbarFillSpace />
                    <ToolbarItem>
                        <Button onClick={() => editDialogApi.openAddDialog()} variant="contained" color="primary">
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
                                            editDialogApi.openEditDialog(row.id);
                                        }}
                                    >
                                        Change Name
                                    </Button>
                                );
                            },
                        },
                    ]}
                />
                <EditDialog>
                    <UserForm mode={selectionMode} id={selectedId} selectionApi={selectionApi} />
                </EditDialog>
            </>
        );
    });
