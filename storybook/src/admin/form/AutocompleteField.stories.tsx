import { Alert, AutocompleteField, FinalForm } from "@comet/admin";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

type Story = StoryObj<typeof AutocompleteField>;
const config: Meta<typeof AutocompleteField> = {
    component: AutocompleteField,
    title: "@comet/admin/form/AutocompleteField",
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
                            <AutocompleteField
                                name="value"
                                label="Autocomplete Field"
                                fullWidth
                                variant="horizontal"
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
