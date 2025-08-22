import { Alert, FinalForm, Future_DatePickerField } from "@comet/admin";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

type Story = StoryObj<typeof Future_DatePickerField>;
const config: Meta<typeof Future_DatePickerField> = {
    component: Future_DatePickerField,
    title: "@comet/admin/datePicker/Future_DatePickerField",
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
                            <Future_DatePickerField name="value" label="Date Picker" fullWidth variant="horizontal" />

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

export const MinMaxDate: Story = {
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
                            <Future_DatePickerField
                                name="value"
                                label="Date Picker with Min/Max Date"
                                fullWidth
                                variant="horizontal"
                                minDate={new Date(2025, 0, 1)}
                                maxDate={new Date(2025, 11, 31)}
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
