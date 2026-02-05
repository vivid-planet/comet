import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { FinalForm } from "../../../FinalForm";
import { FinalFormDebug } from "../../../form/FinalFormDebug";
import { Future_TimePickerField } from "../TimePickerField";

type Story = StoryObj<typeof Future_TimePickerField>;
const config: Meta<typeof Future_TimePickerField> = {
    component: Future_TimePickerField,
    title: "components/dateTime/TimePickerField",
};

export default config;

/**
 * The basic TimePickerField component allows users to select a time.
 *
 * Use this when you need:
 * - A time input in a form
 * - Users to select a specific time from a time picker interface
 * - Time values to be stored as strings
 */
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
                {({ values }: { values: FormValues }) => {
                    return (
                        <>
                            <Future_TimePickerField name="value" label="Time Picker" fullWidth variant="horizontal" />

                            <FinalFormDebug />
                        </>
                    );
                }}
            </FinalForm>
        );
    },
};

/**
 * TimePickerField can be configured with minimum and maximum time constraints.
 *
 * Use this when:
 * - You need to restrict selectable times to a specific range
 * - Business rules require time boundaries (e.g., business hours)
 * - You want to prevent invalid time selections
 */
export const MinMaxTime: Story = {
    args: {
        minTime: new Date(2000, 0, 1, 9, 0),
        maxTime: new Date(2000, 0, 1, 17, 0),
    },
    argTypes: {
        minTime: { control: "date" },
        maxTime: { control: "date" },
    },
    render: (args) => {
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
                {({ values }: { values: FormValues }) => {
                    return (
                        <>
                            <Future_TimePickerField
                                name="value"
                                label="Time Picker with Min/Max Time"
                                fullWidth
                                variant="horizontal"
                                minTime={args.minTime}
                                maxTime={args.maxTime}
                            />

                            <FinalFormDebug />
                        </>
                    );
                }}
            </FinalForm>
        );
    },
};

/**
 * TimePickerField with clearable functionality allows users to reset the selected time.
 *
 * Use this when:
 * - The time field is optional
 * - Users should be able to clear their selection
 * - You want to provide an easy way to reset the field
 */
export const Clearable: Story = {
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
                {({ values }: { values: FormValues }) => {
                    return (
                        <>
                            <Future_TimePickerField clearable name="value" label="Clearable Time Picker" fullWidth variant="horizontal" />

                            <FinalFormDebug />
                        </>
                    );
                }}
            </FinalForm>
        );
    },
};

/**
 * TimePickerField can be disabled to prevent user interaction.
 *
 * Use this when:
 * - The time should be displayed but not editable
 * - Form logic requires certain conditions before editing
 * - You want to show read-only time information
 */
export const Disabled: Story = {
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
                initialValues={{ value: "14:30" }}
                subscription={{ values: true }}
            >
                {({ values }: { values: FormValues }) => {
                    return (
                        <>
                            <Future_TimePickerField disabled name="value" label="Disabled Time Picker" fullWidth variant="horizontal" />

                            <FinalFormDebug />
                        </>
                    );
                }}
            </FinalForm>
        );
    },
};
