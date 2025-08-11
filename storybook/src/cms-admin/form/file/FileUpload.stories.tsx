import { Alert, FinalForm } from "@comet/admin";
import { FileUploadField } from "@comet/cms-admin";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

type Story = StoryObj<typeof FileUploadField>;
const config: Meta<typeof FileUploadField> = {
    component: FileUploadField,
    title: "@comet/cms-admin/form/file/FileUploadField",
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
                            <FileUploadField name="value" label="File Upload Field" fullWidth variant="horizontal" />

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
