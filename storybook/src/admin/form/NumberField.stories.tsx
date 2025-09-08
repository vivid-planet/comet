import { Alert, FinalForm, NumberField } from "@comet/admin";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

type Story = StoryObj<typeof NumberField>;
const config: Meta<typeof NumberField> = {
    component: NumberField,
    title: "@comet/admin/form/NumberField",
};
export default config;

export const Default: Story = {
    render: () => {
        interface FormValues {
            value: number;
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
                            <NumberField name="value" label="Number Field" fullWidth variant="horizontal" />

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
