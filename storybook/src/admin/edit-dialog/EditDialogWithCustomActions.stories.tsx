import { Field, FinalForm, FinalFormInput, OkayButton, Toolbar, ToolbarFillSpace, ToolbarItem, useEditDialog } from "@comet/admin";
import { Button } from "@mui/material";
import * as React from "react";

import { editDialogDecorator } from "../../docs/components/EditDialog/editDialog.decorator";

export default {
    title: "Docs/Components/Edit Dialog with custom actions",
    decorators: [editDialogDecorator()],
};

export const EditDialogWithCustomActions = {
    render: () => {
        const [EditDialog, , editDialogApi] = useEditDialog();

        return (
            <>
                <h2>Click on the button to see the dialog with multiple actions</h2>
                <Toolbar>
                    <ToolbarFillSpace />
                    <ToolbarItem>
                        <Button onClick={() => editDialogApi.openAddDialog()} variant="contained" color="primary">
                            Open dialog
                        </Button>
                    </ToolbarItem>
                </Toolbar>
                <EditDialog
                    componentsProps={{
                        dialogActions: {
                            children: (
                                // TODO: Custom Button is not shown in dialog
                                <OkayButton variant="contained" color="primary" onClick={() => window.alert(`Alternate action selected!`)}>
                                    Alternate action
                                </OkayButton>
                            ),
                        },
                    }}
                >
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
    name: "EditDialog with custom actions",
};
