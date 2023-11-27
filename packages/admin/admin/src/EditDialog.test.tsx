import { Button, createTheme } from "@mui/material";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { IntlProvider } from "react-intl";

import { useEditDialog } from "./EditDialog";
import { FinalForm } from "./FinalForm";
import { Field } from "./form/Field";
import { FinalFormInput } from "./form/FinalFormInput";
import { MuiThemeProvider } from "./mui/ThemeProvider";
import { RouterMemoryRouter } from "./router/MemoryRouter";

describe("EditDialog", () => {
    describe("onAfterSave", () => {
        test("Should call onAfterSave when clicking save button", async () => {
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

            const rendered = render(
                <IntlProvider locale="en" messages={{}}>
                    <MuiThemeProvider theme={createTheme()}>
                        <RouterMemoryRouter>
                            <Story />
                        </RouterMemoryRouter>
                    </MuiThemeProvider>
                </IntlProvider>,
            );

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

            const rendered = render(
                <IntlProvider locale="en" messages={{}}>
                    <MuiThemeProvider theme={createTheme()}>
                        <RouterMemoryRouter>
                            <Story />
                        </RouterMemoryRouter>
                    </MuiThemeProvider>
                </IntlProvider>,
            );

            user.click(rendered.getByText("Open dialog"));

            // Edit dialog title -> dialog is open
            await rendered.findByText("Add");

            user.keyboard("Test");

            user.keyboard("{Enter}");

            await waitFor(() => expect(onAfterSave).toHaveBeenCalledTimes(1));
        });
    });
});
