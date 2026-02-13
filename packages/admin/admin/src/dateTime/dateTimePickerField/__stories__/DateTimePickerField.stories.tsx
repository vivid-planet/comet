import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { FinalForm } from "../../../FinalForm";
import { FinalFormDebug } from "../../../form/FinalFormDebug";
import { Future_DateTimePickerField } from "../DateTimePickerField";

type Story = StoryObj<typeof Future_DateTimePickerField>;
const config: Meta<typeof Future_DateTimePickerField> = {
    component: Future_DateTimePickerField,
    title: "components/dateTime/DateTimePickerField",
};

export default config;

/**
 * The basic DateTimePickerField component allows users to select both a date and time.
 *
 * Use this when you need:
 * - A date and time input in a form
 * - Users to select a specific date and time from a calendar and time picker interface
 * - DateTime values to be stored as Date objects
 */
export const Default: Story = {
    render: () => {
        interface FormValues {
            value: Date;
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
                            <Future_DateTimePickerField name="value" label="Date Time Picker" fullWidth variant="horizontal" />

                            <FinalFormDebug />
                        </>
                    );
                }}
            </FinalForm>
        );
    },
};

/**
 * DateTimePickerField can be configured with minimum and maximum date constraints.
 *
 * Use this when:
 * - You need to restrict selectable dates to a specific range
 * - Business rules require date boundaries
 * - You want to prevent invalid date and time selections
 */
export const MinMaxDate: Story = {
    args: {
        minDate: new Date(2025, 0, 1),
        maxDate: new Date(2025, 11, 31),
    },
    argTypes: {
        minDate: { control: "date" },
        maxDate: { control: "date" },
    },
    render: (args) => {
        interface FormValues {
            value: Date;
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
                            <Future_DateTimePickerField
                                name="value"
                                label="Date Time Picker with Min/Max Date"
                                fullWidth
                                variant="horizontal"
                                minDate={args.minDate}
                                maxDate={args.maxDate}
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
 * DateTimePickerField with clearable functionality allows users to reset the selected date and time.
 *
 * Use this when:
 * - The date time field is optional
 * - Users should be able to clear their selection
 * - You want to provide an easy way to reset the field
 */
export const Clearable: Story = {
    render: () => {
        interface FormValues {
            value: Date;
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
                            <Future_DateTimePickerField clearable name="value" label="Clearable Date Time Picker" fullWidth variant="horizontal" />

                            <FinalFormDebug />
                        </>
                    );
                }}
            </FinalForm>
        );
    },
};

/**
 * DateTimePickerField can be disabled to prevent user interaction.
 *
 * Use this when:
 * - The date and time should be displayed but not editable
 * - Form logic requires certain conditions before editing
 * - You want to show read-only date and time information
 */
export const Disabled: Story = {
    render: () => {
        interface FormValues {
            value: Date;
        }
        return (
            <FinalForm<FormValues>
                mode="edit"
                onSubmit={() => {
                    // not handled
                }}
                initialValues={{ value: new Date(2026, 0, 15, 14, 30) }}
                subscription={{ values: true }}
            >
                {({ values }: { values: FormValues }) => {
                    return (
                        <>
                            <Future_DateTimePickerField disabled name="value" label="Disabled Date Time Picker" fullWidth variant="horizontal" />

                            <FinalFormDebug />
                        </>
                    );
                }}
            </FinalForm>
        );
    },
};
