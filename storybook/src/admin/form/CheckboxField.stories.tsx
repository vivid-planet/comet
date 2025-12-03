import { Alert, CheckboxField, FieldSet, FinalForm } from "@comet/admin";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

type Story = StoryObj<typeof CheckboxField>;
const config: Meta<typeof CheckboxField> = {
    component: CheckboxField,
    title: "@comet/admin/form/CheckboxField",
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
                            <CheckboxField name="value" label="Checkbox Field" fullWidth variant="horizontal" />
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

export const LayoutVariants: Story = {
    render: () => {
        return (
            <FinalForm
                mode="edit"
                onSubmit={() => {
                    // not handled
                }}
            >
                {() => (
                    <Stack spacing={5} p={5}>
                        <FieldSet title="Single line CheckboxField">
                            <CheckboxField
                                name="singleLineHorizontal"
                                fieldLabel="Single Line Horizontal"
                                label="Hello Checkbox"
                                variant="horizontal"
                                fullWidth
                            />
                            <CheckboxField
                                name="singleLineVertical"
                                fieldLabel="Single Line Vertical"
                                label="Hello Checkbox"
                                variant="vertical"
                                fullWidth
                            />
                        </FieldSet>
                        <FieldSet title="Multi line CheckboxField">
                            <CheckboxField
                                name="multiLineHorizontal"
                                fieldLabel="Multi Line Horizontal"
                                label="Nulla vitae elit libero, a pharetra augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed diam eget risus varius blandit sit amet non magna. Nullam quis risus eget urna mollis ornare vel eu leo."
                                variant="horizontal"
                                fullWidth
                            />
                            <CheckboxField
                                name="multiLineVertical"
                                fieldLabel="Multi Line Vertical"
                                label="Nulla vitae elit libero, a pharetra augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed diam eget risus varius blandit sit amet non magna. Nullam quis risus eget urna mollis ornare vel eu leo."
                                variant="vertical"
                                fullWidth
                            />
                        </FieldSet>
                    </Stack>
                )}
            </FinalForm>
        );
    },
};
