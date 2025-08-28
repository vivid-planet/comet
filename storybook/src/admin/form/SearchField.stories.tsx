import { Alert, FinalForm, SearchField } from "@comet/admin";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

type Story = StoryObj<typeof SearchField>;
const config: Meta<typeof SearchField> = {
    component: SearchField,
    title: "@comet/admin/form/SearchField",
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
                            <SearchField name="value" label="Search Field" fullWidth variant="horizontal" />

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
