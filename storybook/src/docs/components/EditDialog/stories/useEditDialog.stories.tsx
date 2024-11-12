import { Field, FinalForm, FinalFormInput, useEditDialog } from "@comet/admin";
import { Button } from "@mui/material";
import * as React from "react";

import { editDialogDecorator } from "../editDialog.decorator";

export default {
    title: "stories/components/EditDialog/useEditDialog",
    decorators: [editDialogDecorator()],
};

export const UseEditDialog = {
    render: () => {
        const [EditDialog, , editDialogApi] = useEditDialog();

        return (
            <>
                <h2>useEditDialog Variant:</h2>
                <Button onClick={() => editDialogApi.openAddDialog()} variant="contained" color="primary">
                    Open Edit Dialog
                </Button>
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
            </>
        );
    },

    name: "useEditDialog",
};
