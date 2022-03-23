import { EditDialog, Field, FinalForm, FinalFormInput, IEditDialogApi } from "@comet/admin";
import { Button } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { editDialogDecorator } from "../editDialog.decorator";

storiesOf("stories/components/EditDialog/Edit Dialog", module)
    .addDecorator(editDialogDecorator())
    .add("Edit Dialog", () => {
        const editDialogApi = React.useRef<IEditDialogApi>(null);

        return (
            <>
                <Button onClick={() => editDialogApi.current?.openAddDialog()}>Open EditDialog</Button>
                <EditDialog ref={editDialogApi}>
                    {() => {
                        return (
                            <FinalForm
                                mode={"add"}
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
