import { Alert } from "@comet/admin";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { useForm } from "react-hook-form";

import { RHFNumberField } from "../../helpers/rhf/RHFNumberField";
import { RHFTextField } from "../../helpers/rhf/RHFTextField";

interface FormValues {
    title: string | null;
    price: number | null;
    stock: number | null;
}

function RHFFormExample() {
    const { control, watch } = useForm<FormValues>({
        defaultValues: {
            title: null,
            price: null,
            stock: null,
        },
    });

    const values = watch();

    return (
        <>
            <RHFTextField name="title" control={control} label="Title" fullWidth variant="horizontal" rules={{ required: true }} />
            <RHFNumberField name="price" control={control} label="Price" fullWidth variant="horizontal" decimals={2} clearable />
            <RHFNumberField name="stock" control={control} label="Stock" fullWidth variant="horizontal" clearable />
            <Alert title="FormState">
                <pre>{JSON.stringify(values, null, 2)}</pre>
            </Alert>
        </>
    );
}

const config: Meta = {
    title: "@comet/admin/form/react-hook-form",
};
export default config;

type Story = StoryObj;

export const RHFTextField_: Story = {
    name: "RHFTextField",
    render: () => {
        interface TextFieldFormValues {
            value: string | null;
        }

        function TextFieldStory() {
            const { control, watch } = useForm<TextFieldFormValues>({
                defaultValues: { value: null },
            });
            const values = watch();
            return (
                <>
                    <RHFTextField name="value" control={control} label="Text Field" fullWidth variant="horizontal" />
                    <Alert title="FormState">
                        <pre>{JSON.stringify(values, null, 2)}</pre>
                    </Alert>
                </>
            );
        }

        return <TextFieldStory />;
    },
};

export const RHFTextField_Clearable: Story = {
    name: "RHFTextField Clearable",
    render: () => {
        interface TextFieldFormValues {
            value: string | null;
        }

        function TextFieldClearableStory() {
            const { control, watch } = useForm<TextFieldFormValues>({
                defaultValues: { value: null },
            });
            const values = watch();
            return (
                <>
                    <RHFTextField clearable name="value" control={control} label="Text Field" fullWidth variant="horizontal" />
                    <Alert title="FormState">
                        <pre>{JSON.stringify(values, null, 2)}</pre>
                    </Alert>
                </>
            );
        }

        return <TextFieldClearableStory />;
    },
};

export const RHFNumberField_: Story = {
    name: "RHFNumberField",
    render: () => {
        interface NumberFieldFormValues {
            value: number | null;
        }

        function NumberFieldStory() {
            const { control, watch } = useForm<NumberFieldFormValues>({
                defaultValues: { value: null },
            });
            const values = watch();
            return (
                <>
                    <RHFNumberField name="value" control={control} label="Number Field" fullWidth variant="horizontal" />
                    <Alert title="FormState">
                        <pre>{JSON.stringify(values, null, 2)}</pre>
                    </Alert>
                </>
            );
        }

        return <NumberFieldStory />;
    },
};

export const RHFForm: Story = {
    render: () => <RHFFormExample />,
};
