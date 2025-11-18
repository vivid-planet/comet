import { Button, Field, FinalForm, FinalFormInput, useEditDialog } from "@comet/admin";
import { DialogContent } from "@mui/material";

import { storyRouterDecorator } from "../../story-router.decorator";

export default {
    title: "@comet/admin/edit-dialog",
    decorators: [storyRouterDecorator()],
};

export const EditDialogStory = {
    render: () => {
        const [EditDialog, , editDialogApi] = useEditDialog();

        return (
            <>
                <h2>Plain Edit Dialog:</h2>
                <Button onClick={() => editDialogApi.openAddDialog()}>Open Edit Dialog</Button>
                <EditDialog>
                    <DialogContent>
                        <FinalForm
                            mode="add"
                            onSubmit={({ name }) => {
                                return new Promise<void>((resolve, reject) => {
                                    console.log("Loading ...");
                                    setTimeout(() => {
                                        console.log("Submitted name:", name);
                                        if (name === "error") {
                                            console.error("Error");
                                            reject(new Error("Simulated submission error"));
                                        } else {
                                            console.log("Success");
                                            resolve();
                                        }
                                    }, 3_000);
                                });
                            }}
                        >
                            <Field
                                label="Name"
                                name="name"
                                component={FinalFormInput}
                                fullWidth
                                autoFocus
                                required
                                helperText="Type 'error' to make the request fail"
                            />
                        </FinalForm>
                    </DialogContent>
                </EditDialog>
            </>
        );
    },
    name: "Plain Edit Dialog",
};
