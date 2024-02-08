import { Field, FinalForm, FinalFormSelect, useEditDialog } from "@comet/admin";
import { Button, MenuItem } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { editDialogDecorator } from "../editDialog.decorator";

storiesOf("stories/components/EditDialog/Form in EditDialog", module)
    .addDecorator(editDialogDecorator())
    .add("Edit Dialog and Form States", () => {
        const [EditDialog, , editDialogApi] = useEditDialog();

        return (
            <>
                <h2>Loading and Error State of EditDialog:</h2>
                <Button onClick={() => editDialogApi.openAddDialog()} variant="contained" color="primary">
                    Open Edit Dialog
                </Button>
                <EditDialog>
                    <FinalForm
                        mode="add"
                        onSubmit={async ({ desiredOutcome }) => {
                            return new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    if (desiredOutcome === "success") {
                                        resolve();
                                    } else {
                                        reject("This is an Error Message");
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
