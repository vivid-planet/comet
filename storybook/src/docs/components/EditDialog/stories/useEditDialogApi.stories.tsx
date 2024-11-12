import { EditDialogApiContext, Field, FinalForm, FinalFormInput, useEditDialog, useEditDialogApi } from "@comet/admin";
import { Button } from "@mui/material";
import * as React from "react";

import { editDialogDecorator } from "../editDialog.decorator";

export default {
    title: "stories/components/EditDialog/useEditDialogApi",
    decorators: [editDialogDecorator()],
};

export const UseEditDialogApi = {
    render: () => {
        const ChildComponentWithOpenButton: React.VoidFunctionComponent = () => {
            const editDialogApi = useEditDialogApi();

            return (
                <Button onClick={() => editDialogApi?.openAddDialog()} variant="contained" color="primary">
                    Open Edit Dialog with useEditDialogApi()
                </Button>
            );
        };

        const [EditDialog, , editDialogApi] = useEditDialog();

        return (
            <EditDialogApiContext.Provider value={editDialogApi}>
                <ChildComponentWithOpenButton />
                <EditDialog>
                    <FinalForm
                        mode="add"
                        onSubmit={async ({ name }) => {
                            window.alert(`Name: ${name}`);
                        }}
                    >
                        <Field label="Name" name="name" component={FinalFormInput} fullWidth autoFocus required />
                    </FinalForm>
                </EditDialog>
            </EditDialogApiContext.Provider>
        );
    },

    name: "useEditDialogApi",
};
