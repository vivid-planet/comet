import { Field, FinalForm, FinalFormSelect, useEditDialog } from "@comet/admin";
import { Button, MenuItem } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { editDialogDecorator } from "../../docs/components/EditDialog/editDialog.decorator";

storiesOf("@comet/admin/edit-dialog", module)
    .addDecorator(editDialogDecorator())
    .add("Edit Dialog States", () => {
        const [EditDialog, , editDialogApi] = useEditDialog();

        return (
            <>
                <h2>Default Loading and Error State of EditDialog:</h2>
                <Button onClick={() => editDialogApi.openAddDialog()} variant="contained" color="primary">
                    Open Edit Dialog
                </Button>
                <EditDialog>
                    <FinalForm
                        mode={"add"}
                        onSubmit={async ({ desiredOutcome }) => {
                            return new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    if (desiredOutcome === "success") {
                                        resolve();
                                    } else {
                                        reject("error");
                                    }
                                }, 3000);
                            });
                        }}
                        initialValues={{
                            desiredOutcome: "success",
                        }}
                    >
                        <Field name="desiredOutcome" label="Desired Outcome" fullWidth>
                            {(props) => (
                                <FinalFormSelect {...props} fullWidth required>
                                    <MenuItem value="success" selected>
                                        Success
                                    </MenuItem>
                                    <MenuItem value="error">Error</MenuItem>
                                </FinalFormSelect>
                            )}
                        </Field>
                    </FinalForm>
                </EditDialog>
            </>
        );
    });
