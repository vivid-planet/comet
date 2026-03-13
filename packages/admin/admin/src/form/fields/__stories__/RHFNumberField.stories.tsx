import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { useForm } from "react-hook-form";

import { RHFNumberField } from "../RHFNumberField";

type Story = StoryObj<typeof RHFNumberField>;
const config: Meta<typeof RHFNumberField> = {
    component: RHFNumberField,
    title: "components/form/RHFNumberField",
};
export default config;

/**
 * The basic RHFNumberField component allows users to enter numeric values in a React Hook Form.
 *
 * Use this when you need:
 * - A number input in a React Hook Form
 * - Integration with react-hook-form's validation and state management
 * - Consistent styling with other Comet form fields
 */
export const Default: Story = {
    render: () => {
        interface FormValues {
            value: number | null;
        }

        function DefaultStory() {
            const { control } = useForm<FormValues>({
                defaultValues: { value: null },
            });
            return <RHFNumberField name="value" control={control} label="Number Field" fullWidth variant="horizontal" />;
        }

        return <DefaultStory />;
    },
};

/**
 * RHFNumberField with clearable functionality allows users to reset the numeric value.
 *
 * Use this when:
 * - The number field is optional
 * - Users should be able to clear their input
 * - You want to provide an easy way to reset the field
 */
export const Clearable: Story = {
    render: () => {
        interface FormValues {
            value: number | null;
        }

        function ClearableStory() {
            const { control } = useForm<FormValues>({
                defaultValues: { value: null },
            });
            return <RHFNumberField clearable name="value" control={control} label="Number Field" fullWidth variant="horizontal" />;
        }

        return <ClearableStory />;
    },
};

/**
 * RHFNumberField with configurable decimal places for monetary values or other precise measurements.
 *
 * Use this when:
 * - You need to display and input decimal numbers
 * - You want to control the number of decimal places
 */
export const WithDecimals: Story = {
    render: () => {
        interface FormValues {
            value: number | null;
        }

        function WithDecimalsStory() {
            const { control } = useForm<FormValues>({
                defaultValues: { value: null },
            });
            return <RHFNumberField decimals={2} name="value" control={control} label="Price" fullWidth variant="horizontal" />;
        }

        return <WithDecimalsStory />;
    },
};

/**
 * RHFNumberField with required validation shows an error message when the field is left empty after submission.
 *
 * Use this when:
 * - The number field is mandatory
 * - You need to enforce input before form submission
 */
export const WithValidation: Story = {
    render: () => {
        interface FormValues {
            value: number | null;
        }

        function ValidationStory() {
            const { control, handleSubmit } = useForm<FormValues>({
                defaultValues: { value: null },
            });
            return (
                <form onSubmit={handleSubmit(() => undefined)}>
                    <RHFNumberField
                        name="value"
                        control={control}
                        label="Required Number"
                        fullWidth
                        variant="horizontal"
                        rules={{ required: true }}
                    />
                    <button type="submit">Submit</button>
                </form>
            );
        }

        return <ValidationStory />;
    },
};
