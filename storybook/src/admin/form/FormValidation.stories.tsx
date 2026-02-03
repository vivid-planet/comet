import { Alert, FinalForm, SaveBoundary, SaveBoundarySaveButton, TextField } from "@comet/admin";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { expect, within } from "storybook/test";

type Story = StoryObj;
const config: Meta = {
    title: "@comet/admin/form/FormValidation",
};
export default config;

export const FormValidation: Story = {
    render: () => {
        interface FormValues {
            text: string;
            text2: string;
            text3: string;
        }
        return (
            <SaveBoundary>
                <FinalForm<FormValues>
                    initialValues={{ text: "", text2: "", text3: "" }}
                    mode="edit"
                    onSubmit={() => {
                        // not handled
                    }}
                    subscription={{
                        values: true,
                        errors: true,
                        submitError: true,
                        submitFailed: true,
                        submitSucceeded: true,
                        hasSubmitErrors: true,
                        touched: true,
                    }}
                >
                    {({ values, errors, touched, submitError, submitFailed, submitSucceeded, hasSubmitErrors }) => {
                        return (
                            <>
                                <TextField name="text" label="Text" fullWidth required />
                                <TextField
                                    name="text2"
                                    label="Text"
                                    helperText="Text must be more than 5 characters"
                                    fullWidth
                                    required
                                    validate={(value) => {
                                        if (value != null && value.length < 5) {
                                            return "Text must be more than 5 characters";
                                        }
                                    }}
                                />
                                <TextField name="text3" label="Text" fullWidth required />

                                <SaveBoundarySaveButton data-testid="saveButton" />
                                <Alert
                                    title="FormState"
                                    slotProps={{
                                        text: {
                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                            // @ts-expect-error
                                            component: "div",
                                        },
                                    }}
                                >
                                    <pre>
                                        {JSON.stringify(
                                            { submitError, submitFailed, submitSucceeded, hasSubmitErrors, touched, values, errors },
                                            null,
                                            2,
                                        )}
                                    </pre>
                                </Alert>
                            </>
                        );
                    }}
                </FinalForm>
            </SaveBoundary>
        );
    },
    play: async ({ canvas, userEvent, step }) => {
        const textFieldInputElement = canvas.getByTestId("text-input");
        const saveButton = canvas.getByTestId("saveButton");

        await step("Initial State", async () => {
            expect(textFieldInputElement).toBeInTheDocument();
            expect(saveButton).toBeInTheDocument();
            expect(saveButton).toBeDisabled();
        });

        await step("Enter Data State", async () => {
            await userEvent.type(textFieldInputElement, "Lorem ipsum");
            expect(textFieldInputElement).toHaveValue("Lorem ipsum");
            expect(saveButton).not.toBeDisabled();

            await userEvent.click(saveButton);
        });

        await step("Required Fields should report error", async () => {
            const textField2 = canvas.getByTestId("text2-field-container-helper-texts-wrapper");
            expect(textField2).toBeInTheDocument();

            const isRequiredTextField2 = within(textField2).getByText("Required");
            expect(isRequiredTextField2).toBeInTheDocument();

            const textField3 = canvas.getByTestId("text3-field-container-helper-texts-wrapper");
            expect(textField3).toBeInTheDocument();

            const isRequiredTextField3 = within(textField3).getByText("Required");
            expect(isRequiredTextField3).toBeInTheDocument();
        });
    },
};
