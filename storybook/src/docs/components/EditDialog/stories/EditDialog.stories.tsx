import { EditDialog, Field, FinalForm, FinalFormInput, IEditDialogApi } from "@comet/admin";
import { Button } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { editDialogDecorator } from "../editDialog.decorator";

storiesOf("stories/components/EditDialog/Edit Dialog docs only", module)
    .addDecorator(editDialogDecorator())
    .add("Edit Dialog", () => {
        const editDialogApi = React.useRef<IEditDialogApi>(null);

        return (
            <>
                <h2>EditDialog Component Variant:</h2>
                <Button onClick={() => editDialogApi.current?.openAddDialog()} variant="contained" color="primary">
                    Open Edit Dialog
                </Button>
                <EditDialog ref={editDialogApi}>
                    {() => {
                        return (
                            <FinalForm
                                mode="add"
                                onSubmit={async ({ name }) => {
                                    window.alert(`Name: ${name}`);
                                }}
                            >
                                <Field label="Name" name="name" component={FinalFormInput} fullWidth autoFocus required />
                            </FinalForm>
                        );
                    }}
                </EditDialog>
            </>
        );
    });
