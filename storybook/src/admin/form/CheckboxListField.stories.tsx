import { Alert, CheckboxListField, FinalForm } from "@comet/admin";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

type Story = StoryObj<typeof CheckboxListField>;
const config: Meta<typeof CheckboxListField> = {
    component: CheckboxListField,
    title: "@comet/admin/form/CheckboxListField",
};
export default config;

export const Default: Story = {
    render: () => {
        interface FormValues {
            value: string;
        }
        return (
            <FinalForm<FormValues>
                mode="edit"
                onSubmit={() => {
                    // not handled
                }}
                subscription={{ values: true }}
            >
                {({ values }) => {
                    return (
                        <>
                            <CheckboxListField
                                options={[
                                    {
                                        label: "Option 1",
                                        value: "option1",
                                    },
                                    {
                                        label: "Option 2",
                                        value: "option2",
                                    },
                                    {
                                        label: "Option 3",
                                        value: "option3",
                                    },
                                ]}
                                name="value"
                                label="Checkbox List Field"
                                fullWidth
                                variant="horizontal"
                            />

                            <Alert title="FormState">
                                <pre>{JSON.stringify(values, null, 2)}</pre>
                            </Alert>
                        </>
                    );
                }}
            </FinalForm>
        );
    },
};
