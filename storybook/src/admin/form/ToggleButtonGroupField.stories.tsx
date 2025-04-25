import { Alert, FinalForm, NumberField, TextField, ToggleButtonGroupField } from "@comet/admin";
import { Info } from "@comet/admin-icons";
import { Box, Divider } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof ToggleButtonGroupField>;
const config: Meta<typeof ToggleButtonGroupField> = {
    component: ToggleButtonGroupField,
    title: "@comet/admin/form/Toggle Button Group Field",
};

export default config;

/**
 * This story demonstrates the simple usage of the `ToggleButtonGroupField` component.
 */
export const ToggleButtonFieldStory: Story = {
    storyName: "ToggleButtonGroupField",
    render: () => {
        type SampleType = "label" | "label-2" | "icon" | "icon+label";
        interface FormValues {
            type: SampleType;
        }
        return (
            <FinalForm<FormValues>
                initialValues={{ type: "label" }}
                mode="edit"
                onSubmit={() => {
                    // not handled
                }}
                subscription={{ values: true }}
            >
                {({ values }) => {
                    return (
                        <>
                            <ToggleButtonGroupField<SampleType>
                                label="Sample Type"
                                name="type"
                                options={[
                                    {
                                        label: "Label",
                                        value: "label",
                                    },
                                    {
                                        label: "Label 2",
                                        value: "label-2",
                                    },
                                    {
                                        label: <Info />,
                                        value: "icon",
                                    },
                                    {
                                        label: (
                                            <Box display="flex" gap={2}>
                                                <Info />
                                                Icon and Label
                                            </Box>
                                        ),
                                        value: "icon+label",
                                    },
                                ]}
                            />

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

/**
 * Sometimes it is necessary to show more options, which do not fit into one row, with the `optionsPerRow` prop it is possible to
 * define how many options should be shown in one row.
 */
export const MultipleRowsExample: Story = {
    storyName: "ToggleButtonGroupField",
    render: () => {
        type SampleType = "value-1" | "value-2" | "value-3" | "value-4" | "value-5" | "value-6";
        interface FormValues {
            type: SampleType;
        }
        return (
            <FinalForm<FormValues>
                initialValues={{ type: "value-1" }}
                mode="edit"
                onSubmit={() => {
                    // not handled
                }}
                subscription={{ values: true }}
            >
                {({ values }) => {
                    return (
                        <>
                            <ToggleButtonGroupField<SampleType>
                                label="Sample Type"
                                name="type"
                                optionsPerRow={3}
                                options={[
                                    {
                                        label: "Value 1",
                                        value: "value-1",
                                    },
                                    {
                                        label: "Value 2",
                                        value: "value-2",
                                    },
                                    {
                                        label: "Value 3",
                                        value: "value-3",
                                    },
                                    {
                                        label: "Value 4",
                                        value: "value-4",
                                    },
                                    {
                                        label: "Value 5",
                                        value: "value-5",
                                    },
                                    {
                                        label: "Value 6",
                                        value: "value-6",
                                    },
                                ]}
                            />

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

/**
 * This story demonstrates the usage of the `ToggleButtonGroupField` component with a more complex form.
 *
 * The `ToggleButtonGroupField` Component is typically used to switch between two or more options, which additionally shows/hides different parts of the form.
 *
 * In this Showcase, the AddressType's - `ToggleButtonGroupField` - toggles between Address and Coordinates and shows/hides the corresponding fields.
 */
export const ToggleButtonFieldAddressSample: Story = {
    storyName: "ToggleButtonGroupField",
    render: () => {
        type AddressType = "address" | "coordinates";
        interface FormValues {
            type: AddressType;
            address?: {
                city: string;
                street: string;
                streetNumber: number;
                postcode: string;
            };
            coordinates: {
                longitude: number;
                latitude: number;
            };
        }
        return (
            <FinalForm<FormValues>
                initialValues={{ type: "address" }}
                mode="edit"
                onSubmit={() => {
                    // not handled
                }}
                subscription={{ values: true }}
            >
                {({ values }) => {
                    return (
                        <Box display="flex" gap={2} flexDirection="column">
                            <ToggleButtonGroupField<AddressType>
                                label="AddressType"
                                name="type"
                                options={[
                                    {
                                        label: "Address",
                                        value: "address",
                                    },
                                    {
                                        label: "Coordinates",
                                        value: "coordinates",
                                    },
                                ]}
                            />

                            <Box marginBottom={2}>
                                <Divider />
                            </Box>
                            {values.type === "address" && (
                                <>
                                    <NumberField name="address.postcode" label="Postcode" />
                                    <TextField name="address.city" label="City" />
                                    <TextField name="address.street" label="Street" />
                                </>
                            )}

                            {values.type === "coordinates" && (
                                <>
                                    <NumberField name="coordinates.latitude" label="Latitude" decimals={14} />
                                    <NumberField name="coordinates.longitude" label="Longitude" decimals={14} />
                                </>
                            )}
                            <Alert title="FormState">
                                <pre>{JSON.stringify(values, null, 2)}</pre>
                            </Alert>
                        </Box>
                    );
                }}
            </FinalForm>
        );
    },
};
