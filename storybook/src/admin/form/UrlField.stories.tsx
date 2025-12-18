import { Alert, FinalForm, UrlField } from "@comet/admin";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

type Story = StoryObj<typeof UrlField>;
const config: Meta<typeof UrlField> = {
    component: UrlField,
    title: "@comet/admin/form/UrlField",
};

export default config;

export const Default: Story = {
    render: () => {
        interface FormValues {
            website: string;
            email: string;
            phone: string;
            customProtocol: string;
            existingProtocol: string;
        }

        return (
            <FinalForm<FormValues>
                mode="edit"
                onSubmit={() => {
                    // not handled
                }}
                initialValues={{
                    website: "",
                    email: "",
                    phone: "",
                    customProtocol: "",
                    existingProtocol: "mailto:support@example.com",
                }}
                subscription={{ values: true }}
            >
                {({ values }) => (
                    <>
                        <UrlField
                            name="website"
                            label="Website"
                            placeholder="example.com"
                            helperText="Try entering 'example.com' - https:// will be added automatically on blur"
                            fullWidth
                            variant="horizontal"
                        />

                        <UrlField
                            name="email"
                            label="Email"
                            placeholder="contact@example.com"
                            helperText="Try entering 'contact@example.com' - mailto: will be added automatically"
                            fullWidth
                            variant="horizontal"
                        />

                        <UrlField
                            name="phone"
                            label="Phone"
                            placeholder="+1 234 567 890"
                            helperText="Try entering '+1 234 567 890' - tel: will be added and formatting removed"
                            fullWidth
                            variant="horizontal"
                        />

                        <UrlField
                            name="customProtocol"
                            label="Custom Protocol"
                            placeholder="ftp://files.example.com"
                            helperText="URLs with existing protocols (ftp://, file://, etc.) remain unchanged"
                            fullWidth
                            variant="horizontal"
                        />

                        <UrlField
                            name="existingProtocol"
                            label="Pre-filled with Protocol"
                            helperText="This field already has a protocol and won't be modified"
                            fullWidth
                            variant="horizontal"
                        />

                        <Alert title="Form Values" severity="info">
                            <pre>{JSON.stringify(values, null, 2)}</pre>
                        </Alert>
                    </>
                )}
            </FinalForm>
        );
    },
};
