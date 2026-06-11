import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { useForm } from "react-hook-form";

import { RHFTextField } from "../RHFTextField";

type Story = StoryObj<typeof RHFTextField>;
const config: Meta<typeof RHFTextField> = {
    component: RHFTextField,
    title: "components/form/RHFTextField",
};
export default config;

/**
 * The basic RHFTextField component allows users to enter text values in a React Hook Form.
 *
 * Use this when you need:
 * - A simple text input in a React Hook Form
 * - Integration with react-hook-form's validation and state management
 * - Consistent styling with other Comet form fields
 */
export const Default: Story = {
    render: () => {
        interface FormValues {
            value: string | null;
        }

        function DefaultStory() {
            const { control } = useForm<FormValues>({
                defaultValues: { value: null },
            });
            return <RHFTextField name="value" control={control} label="Text Field" fullWidth variant="horizontal" />;
        }

        return <DefaultStory />;
    },
};

/**
 * RHFTextField with required validation shows an error message when the field is left empty after submission.
 *
 * Use this when:
 * - The text field is mandatory
 * - You need to enforce input before form submission
 */
export const WithValidation: Story = {
    render: () => {
        interface FormValues {
            value: string | null;
        }

        function ValidationStory() {
            const { control, handleSubmit } = useForm<FormValues>({
                defaultValues: { value: null },
            });
            return (
                <form onSubmit={handleSubmit(() => undefined)} noValidate>
                    <RHFTextField required name="value" control={control} label="Required Field" fullWidth variant="horizontal" />
                    <button type="submit">Submit</button>
                </form>
            );
        }

        return <ValidationStory />;
    },
};
