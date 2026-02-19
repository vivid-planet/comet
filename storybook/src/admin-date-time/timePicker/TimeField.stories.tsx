import { Alert, FinalForm } from "@comet/admin";
import { TimeField } from "@comet/admin-date-time";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

type Story = StoryObj<typeof TimeField>;
const config: Meta<typeof TimeField> = {
    component: TimeField,
    title: "@comet/admin-date-time/timePicker/TimeField",
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
                            <TimeField name="value" label="Time Field" fullWidth variant="horizontal" />

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

export const MinuteStep: Story = {
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
                            <TimeField name="value" label="Time Field" fullWidth variant="horizontal" minuteStep={5} />

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
