import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { FinalForm } from "../../../FinalForm";
import { FinalFormDebug } from "../../../form/FinalFormDebug";
import { Future_DatePickerField } from "../DatePickerField";

type Story = StoryObj<typeof Future_DatePickerField>;
const config: Meta<typeof Future_DatePickerField> = {
    component: Future_DatePickerField,
    title: "components/dateTime/DatePickerField",
};

export default config;

/**
 * The basic DatePickerField component allows users to select a date.
 *
 * Use this when you need:
 * - A simple date input in a form
 * - Users to select a specific date from a calendar interface
 * - Date values to be stored as strings
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
                            <Future_DatePickerField name="value" label="Date Picker" fullWidth variant="horizontal" />

                            <FinalFormDebug />
                        </>
                    );
                }}
            </FinalForm>
        );
    },
};

/**
 * DatePickerField can be configured with minimum and maximum date constraints.
 *
 * Use this when:
 * - You need to restrict selectable dates to a specific range
 * - Business rules require date boundaries
 * - You want to prevent invalid date selections
 */
export const MinMaxDate: Story = {
    args: {
        minDate: new Date(2025, 0, 1),
        maxDate: new Date(2025, 11, 31),
    },
    argTypes: {
        minDate: {
            control: "date",
        },
        maxDate: {
            control: "date",
        },
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
                            <Future_DatePickerField
                                name="value"
                                label="Date Picker with Min/Max Date"
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
 * DatePickerField with clearable functionality allows users to reset the selected date.
 *
 * Use this when:
 * - The date field is optional
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
                            <Future_DatePickerField clearable name="value" label="Clearable Date Picker" fullWidth variant="horizontal" />

                            <FinalFormDebug />
                        </>
                    );
                }}
            </FinalForm>
        );
    },
};

/**
 * DatePickerField can be disabled to prevent user interaction.
 *
 * Use this when:
 * - The date should be displayed but not editable
 * - Form logic requires certain conditions before editing
 * - You want to show read-only date information
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
                initialValues={{ value: "2026-01-15" }}
                subscription={{ values: true }}
            >
                {({ values }: { values: FormValues }) => {
                    return (
                        <>
                            <Future_DatePickerField disabled name="value" label="Disabled Date Picker" fullWidth variant="horizontal" />

                            <FinalFormDebug />
                        </>
                    );
                }}
            </FinalForm>
        );
    },
};
