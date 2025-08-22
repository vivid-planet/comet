import { Alert, FinalForm } from "@comet/admin";
import { DateRangeField } from "@comet/admin-date-time";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

type Story = StoryObj<typeof DateRangeField>;
const config: Meta<typeof DateRangeField> = {
    component: DateRangeField,
    title: "@comet/admin-date-time/dateRangePicker/DateRangeField",
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
                            <DateRangeField name="value" label="Date Range Field" fullWidth variant="horizontal" />

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
                            <DateRangeField
                                name="value"
                                label="Date Range Field"
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
