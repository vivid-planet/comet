import { EditDialog, Field, FinalForm, FinalFormInput } from "@comet/admin";
import { Button } from "@mui/material";
import * as React from "react";

function Story() {
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
}

/*
storiesOf("stories/components/EditDialog/Edit Dialog", module)
    .addDecorator(editDialogDecorator())
    .add("Edit Dialog", () => {
        const editDialogApi = React.useRef<IEditDialogApi>(null);
    });
*/

export default Story;
