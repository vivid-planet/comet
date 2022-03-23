import { Field, FinalForm, FinalFormInput, useEditDialog } from "@comet/admin";
import { Button } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { editDialogDecorator } from "../editDialog.decorator";

storiesOf("stories/components/EditDialog/useEditDialog", module)
    .addDecorator(editDialogDecorator())
    .add("useEditDialog", () => {
        const [EditDialog, , editDialogApi] = useEditDialog();

        return (
            <>
                <Button onClick={() => editDialogApi.openAddDialog()}>Open EditDialog</Button>
                <EditDialog>
                    <FinalForm
                        mode={"add"}
                        onSubmit={async ({ name }) => {
                            window.alert(`Name: ${name}`);
                        }}
                    >
                        <Field label="Name" name="name" component={FinalFormInput} fullWidth autoFocus required />
                    </FinalForm>
                </EditDialog>
            </>
        );
    });
