import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "test-utils";

import { Button } from "./common/buttons/Button";
import { useEditDialog } from "./EditDialog";
import { FinalForm } from "./FinalForm";
import { Field } from "./form/Field";
import { FinalFormInput } from "./form/FinalFormInput";

describe("EditDialog", () => {
    describe("onAfterSave", () => {
        test("Should call onAfterSave when clicking save button", async () => {
            const user = userEvent.setup();
            const onAfterSave = jest.fn();

            function Story() {
                const [EditDialog, , editDialogApi] = useEditDialog();

                return (
                    <>
                        <Button variant="textDark" onClick={() => editDialogApi.openAddDialog()}>
                            Open dialog
                        </Button>
                        <EditDialog onAfterSave={onAfterSave}>
                            <FinalForm
                                mode="edit"
                                onSubmit={async () => {
                                    // noop
                                }}
                            >
                                <Field name="name" component={FinalFormInput} autoFocus />
                            </FinalForm>
                        </EditDialog>
                    </>
                );
            }

            const rendered = render(<Story />);

            user.click(rendered.getByText("Open dialog"));

            // Edit dialog title -> dialog is open
            await rendered.findByText("Add");

            user.keyboard("Test");

            user.click(screen.getByText("Save"));

            await waitFor(() => expect(onAfterSave).toHaveBeenCalledTimes(1));
        });

        test("Should call onAfterSave when pressing Enter", async () => {
            const user = userEvent.setup();
            const onAfterSave = jest.fn();

            function Story() {
                const [EditDialog, , editDialogApi] = useEditDialog();

                return (
                    <>
                        <Button onClick={() => editDialogApi.openAddDialog()}>Open dialog</Button>
                        <EditDialog onAfterSave={onAfterSave}>
                            <FinalForm
                                mode="edit"
                                onSubmit={async () => {
                                    // noop
                                }}
                            >
                                <Field name="name" component={FinalFormInput} autoFocus />
                            </FinalForm>
                        </EditDialog>
                    </>
                );
            }

            const rendered = render(<Story />);

            user.click(rendered.getByText("Open dialog"));

            // Edit dialog title -> dialog is open
            await rendered.findByText("Add");

            user.keyboard("Test");

            user.keyboard("{Enter}");

            await waitFor(() => expect(onAfterSave).toHaveBeenCalledTimes(1));
        });
    });
});
