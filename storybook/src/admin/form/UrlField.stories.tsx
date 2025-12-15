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
            supportContact: string;
        }

        return (
            <FinalForm<FormValues>
                mode="edit"
                onSubmit={() => {
                    // not handled
                }}
                initialValues={{
                    website: "",
                    supportContact: "mailto:support@example.com",
                }}
                subscription={{ values: true }}
            >
                {({ values }) => (
                    <>
                        <UrlField
                            name="website"
                            label="Website"
                            placeholder="example.com"
                            helperText="Blur the field to add https:// automatically when no protocol is provided."
                            fullWidth
                            variant="horizontal"
                        />

                        <UrlField
                            name="supportContact"
                            label="Support contact"
                            helperText="Protocols like mailto: stay unchanged."
                            fullWidth
                            variant="horizontal"
                        />

                        <Alert title="FormState">
                            <pre>{JSON.stringify(values, null, 2)}</pre>
                        </Alert>
                    </>
                )}
            </FinalForm>
        );
    },
};
