import { gql, useApolloClient } from "@apollo/client";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { SaveButton } from "../../../common/buttons/SaveButton";
import { FinalForm } from "../../../FinalForm";
import { FinalFormDebug } from "../../../form/FinalFormDebug";
import { AsyncAutocompleteField } from "../AsyncAutocompleteField";
import { TextField } from "../TextField";
import { ApolloDecorator } from "../../../../.storybook/decorators/Apollo.decorator";
import type { Manufacturer } from "../../../../.storybook/mocks/handlers";
import { WarningSolid } from "@comet/admin-icons";

type Story = StoryObj<typeof AsyncAutocompleteField>;
const config: Meta<typeof AsyncAutocompleteField> = {
    component: AsyncAutocompleteField,
    title: "components/form/AsyncAutocompleteField",
    decorators: [ApolloDecorator("/graphql")],
};
export default config;

// Helper function to load manufacturers from GraphQL
const useLoadManufacturers = () => {
    const client = useApolloClient();
    
    return async (search?: string) => {
        const { data } = await client.query<{ manufacturers: Manufacturer[] }, { search?: string }>({
            query: gql`
                query Manufacturers($search: String) {
                    manufacturers(search: $search) {
                        id
                        name
                    }
                }
            `,
            variables: {
                search,
            },
        });

        return data.manufacturers.map((manufacturer) => ({
            value: manufacturer.id,
            label: manufacturer.name,
        }));
    };
};

/**
 * Simple example of using AsyncAutocompleteField with data loaded from an API.
 * The options are loaded asynchronously, simulating a network request.
 */
export const WithObjectOptions: Story = {
    render: () => {
        const loadManufacturers = useLoadManufacturers();

        interface FormValues {
            manufacturer: {
                label: string;
                value: string;
            };
        }
        return (
            <FinalForm<FormValues>
                initialValues={{}}
                mode="edit"
                onSubmit={() => {
                    // not handled
                }}
                subscription={{ values: true }}
            >
                {({ values }) => {
                    return (
                        <>
                            <AsyncAutocompleteField
                                loadOptions={loadManufacturers}
                                name="manufacturer"
                                label="Manufacturer"
                                fullWidth
                                variant="horizontal"
                                getOptionLabel={(option) => {
                                    return option.label;
                                }}
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
 * AsyncAutocompleteField with required validation.
 *
 * Use this when:
 * - The field must have a value before form submission
 */
export const Required: Story = {
    render: () => {
        const loadManufacturers = useLoadManufacturers();

        interface FormValues {
            manufacturer: {
                label: string;
                value: string;
            };
            anotherField: string;
        }
        return (
            <FinalForm<FormValues>
                initialValues={{
                    anotherField: "",
                }}
                mode="edit"
                onSubmit={(values) => {
                    window.alert(`Form submitted with Values: ${JSON.stringify(values)}`);
                }}
                subscription={{ values: true, dirty: true }}
            >
                {({ values, dirty }) => {
                    return (
                        <>
                            <TextField name="anotherField" label="Anotherfield" variant="horizontal" />
                            <AsyncAutocompleteField
                                required
                                clearable
                                loadOptions={loadManufacturers}
                                name="manufacturer"
                                label="Manufacturer"
                                fullWidth
                                variant="horizontal"
                                getOptionLabel={(option) => {
                                    return option.label;
                                }}
                            />
                            <SaveButton type="submit" disabled={!dirty} />

                            <FinalFormDebug />
                        </>
                    );
                }}
            </FinalForm>
        );
    },
};

/**
 * AsyncAutocompleteField with multiple selection enabled.
 */
export const MultipleSelect: Story = {
    render: () => {
        const loadManufacturers = useLoadManufacturers();

        interface FormValues {
            manufacturers: {
                label: string;
                value: string;
            }[];
        }
        return (
            <FinalForm<FormValues>
                initialValues={{
                    manufacturers: [],
                }}
                mode="edit"
                onSubmit={() => {
                    // not handled
                }}
                subscription={{ values: true }}
            >
                {({ values }) => {
                    return (
                        <>
                            <AsyncAutocompleteField
                                multiple
                                loadOptions={loadManufacturers}
                                name="manufacturers"
                                label="Manufacturers"
                                fullWidth
                                variant="horizontal"
                                getOptionLabel={(option) => {
                                    return option.label;
                                }}
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
 * Multiple select with required validation.
 */
export const MultipleWithRequired: Story = {
    render: () => {
        const loadManufacturers = useLoadManufacturers();

        interface FormValues {
            anotherField: string;
            manufacturers: {
                label: string;
                value: string;
            }[];
        }
        return (
            <FinalForm<FormValues>
                initialValues={{
                    manufacturers: [],
                }}
                mode="edit"
                onSubmit={(values) => {
                    window.alert(`Form submitted with Values: ${JSON.stringify(values)}`);
                }}
                subscription={{ values: true, dirty: true }}
            >
                {({ values, dirty }) => {
                    return (
                        <>
                            <TextField name="anotherField" label="Anotherfield" variant="horizontal" />

                            <AsyncAutocompleteField
                                multiple
                                clearable
                                loadOptions={loadManufacturers}
                                name="manufacturers"
                                label="Manufacturers"
                                fullWidth
                                required
                                variant="horizontal"
                                getOptionLabel={(option) => {
                                    return option.label;
                                }}
                            />

                            <SaveButton type="submit" disabled={!dirty}>
                                Submit
                            </SaveButton>
                            <FinalFormDebug />
                        </>
                    );
                }}
            </FinalForm>
        );
    },
};

/**
 * Multiple autocomplete without initial values.
 */
export const MultipleAutocompleteNoInitialValues: Story = {
    render: () => {
        const loadManufacturers = useLoadManufacturers();

        interface FormValues {
            manufacturers: {
                label: string;
                value: string;
            }[];
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
                            <AsyncAutocompleteField
                                multiple
                                loadOptions={loadManufacturers}
                                name="manufacturers"
                                label="Manufacturers"
                                fullWidth
                                variant="horizontal"
                                getOptionLabel={(option) => {
                                    return option.label;
                                }}
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
 * AsyncAutocompleteField with long loading time to demonstrate loading state.
 */
export const LongLoading: Story = {
    render: () => {
        const client = useApolloClient();

        interface FormValues {
            manufacturer: {
                label: string;
                value: string;
            };
        }
        return (
            <FinalForm<FormValues>
                initialValues={{}}
                mode="edit"
                onSubmit={() => {
                    // not handled
                }}
                subscription={{ values: true }}
            >
                {({ values }) => {
                    return (
                        <>
                            <AsyncAutocompleteField
                                loadOptions={async (search) => {
                                    // Simulate very long network delay
                                    await new Promise((resolve) => setTimeout(resolve, 5000));

                                    const { data } = await client.query<{ manufacturers: Manufacturer[] }, { search?: string }>({
                                        query: gql`
                                            query Manufacturers($search: String) {
                                                manufacturers(search: $search) {
                                                    id
                                                    name
                                                }
                                            }
                                        `,
                                        variables: {
                                            search,
                                        },
                                    });

                                    return data.manufacturers.map((manufacturer) => ({
                                        value: manufacturer.id,
                                        label: manufacturer.name,
                                    }));
                                }}
                                name="manufacturer"
                                label="Manufacturer"
                                fullWidth
                                variant="horizontal"
                                getOptionLabel={(option) => {
                                    return option.label;
                                }}
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
 * AsyncAutocompleteField with error state when loading fails.
 */
export const ErrorLoadingOptions: Story = {
    render: () => {
        interface FormValues {
            manufacturer: {
                label: string;
                value: string;
            };
        }
        return (
            <FinalForm<FormValues>
                initialValues={{}}
                mode="edit"
                onSubmit={() => {
                    // not handled
                }}
                subscription={{ values: true }}
            >
                {({ values }) => {
                    return (
                        <>
                            <AsyncAutocompleteField
                                loadOptions={async () => {
                                    // simulate loading
                                    await new Promise((resolve) => setTimeout(resolve, 500));
                                    throw Error("Error loading options");
                                }}
                                name="manufacturer"
                                label="Manufacturer"
                                fullWidth
                                variant="horizontal"
                                getOptionLabel={(option) => {
                                    return option.label;
                                }}
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
 * AsyncAutocompleteField loading data from API.
 */
export const AsyncAutocompleteLoadingDataFromApi: Story = {
    render: () => {
        const loadManufacturers = useLoadManufacturers();

        interface FormValues {
            manufacturer: {
                id: string;
                name: string;
            };
        }
        return (
            <FinalForm<FormValues>
                initialValues={{}}
                mode="edit"
                onSubmit={() => {
                    // not handled
                }}
                subscription={{ values: true }}
            >
                {({ values }) => {
                    return (
                        <>
                            <AsyncAutocompleteField
                                loadOptions={loadManufacturers}
                                name="manufacturer"
                                label="Manufacturer"
                                fullWidth
                                variant="horizontal"
                                getOptionLabel={(option) => {
                                    return option.label;
                                }}
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
 * AsyncAutocompleteField with error state and custom error text.
 */
export const ErrorLoadingOptionsWithCustomErrorText: Story = {
    render: () => {
        interface FormValues {
            manufacturer: {
                label: string;
                value: string;
            };
        }
        return (
            <FinalForm<FormValues>
                initialValues={{}}
                mode="edit"
                onSubmit={() => {
                    // not handled
                }}
                subscription={{ values: true }}
            >
                {({ values }) => {
                    return (
                        <>
                            <AsyncAutocompleteField
                                loadOptions={async () => {
                                    // simulate loading
                                    await new Promise((resolve) => setTimeout(resolve, 500));
                                    throw Error("Error loading options");
                                }}
                                name="manufacturer"
                                label="Manufacturer"
                                fullWidth
                                variant="horizontal"
                                getOptionLabel={(option) => {
                                    return option.label;
                                }}
                                errorText={
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "black" }}>
                                        <WarningSolid color="error" />
                                        Error loading options
                                    </div>
                                }
                            />

                            <FinalFormDebug />
                        </>
                    );
                }}
            </FinalForm>
        );
    },
};
