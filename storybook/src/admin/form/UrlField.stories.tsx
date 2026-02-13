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

export const WebOnlyProtocols: Story = {
    render: () => {
        interface FormValues {
            secureUrl: string;
            anotherUrl: string;
        }

        return (
            <FinalForm<FormValues>
                mode="edit"
                onSubmit={() => {
                    // not handled
                }}
                initialValues={{
                    secureUrl: "",
                    anotherUrl: "",
                }}
                subscription={{ values: true }}
            >
                {({ values }) => (
                    <>
                        <Alert severity="info" title="Web-Only Mode">
                            These fields only accept https:// and http:// protocols. Try entering:
                            <ul>
                                <li>✅ example.com (will be converted to https://example.com)</li>
                                <li>✅ http://example.com</li>
                                <li>❌ mailto:test@example.com (will show error)</li>
                                <li>❌ tel:+1234567890 (will show error)</li>
                                <li>❌ ftp://files.example.com (will show error)</li>
                            </ul>
                        </Alert>

                        <UrlField
                            name="secureUrl"
                            label="Secure URL (Web Only)"
                            placeholder="example.com"
                            helperText="Only https:// and http:// protocols are allowed"
                            allowedProtocols="web-only"
                            fullWidth
                            variant="horizontal"
                            required
                        />

                        <UrlField
                            name="anotherUrl"
                            label="Another Web URL"
                            placeholder="https://example.com"
                            allowedProtocols="web-only"
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

export const CustomAllowedProtocols: Story = {
    render: () => {
        interface FormValues {
            contactUrl: string;
            fileUrl: string;
        }

        return (
            <FinalForm<FormValues>
                mode="edit"
                onSubmit={() => {
                    // not handled
                }}
                initialValues={{
                    contactUrl: "",
                    fileUrl: "",
                }}
                subscription={{ values: true }}
            >
                {({ values }) => (
                    <>
                        <Alert severity="info" title="Custom Protocol Lists">
                            Each field has a custom list of allowed protocols.
                        </Alert>

                        <UrlField
                            name="contactUrl"
                            label="Contact URL"
                            placeholder="test@example.com or +1234567890"
                            helperText="Only mailto: and tel: protocols are allowed (no web URLs)"
                            allowedProtocols={["mailto", "tel"]}
                            fullWidth
                            variant="horizontal"
                        />

                        <UrlField
                            name="fileUrl"
                            label="File/FTP URL"
                            placeholder="ftp://files.example.com"
                            helperText="Only https:, ftp:, and file: protocols are allowed"
                            allowedProtocols={["https", "ftp", "file"]}
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

export const SecurityExample: Story = {
    render: () => {
        interface FormValues {
            safeUrl: string;
            unsafeAttempt: string;
        }

        return (
            <FinalForm<FormValues>
                mode="edit"
                onSubmit={() => {
                    // not handled
                }}
                initialValues={{
                    safeUrl: "",
                    unsafeAttempt: "",
                }}
                subscription={{ values: true }}
            >
                {({ values }) => (
                    <>
                        <Alert severity="warning" title="Security Protection">
                            Dangerous protocols (javascript:, data:, vbscript:) are always blocked, even when allowedProtocols is set to "all". This
                            prevents XSS attacks. Try entering:
                            <ul>
                                <li>❌ javascript:alert(1)</li>
                                <li>❌ data:text/html,&lt;script&gt;alert(1)&lt;/script&gt;</li>
                                <li>✅ https://example.com</li>
                            </ul>
                        </Alert>

                        <UrlField
                            name="safeUrl"
                            label="URL with Security Protection"
                            placeholder="Try entering 'javascript:alert(1)'"
                            helperText="Dangerous protocols are automatically blocked"
                            fullWidth
                            variant="horizontal"
                        />

                        <UrlField
                            name="unsafeAttempt"
                            label="Another Protected Field"
                            placeholder="Try 'data:text/html,...'"
                            allowedProtocols="all"
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
