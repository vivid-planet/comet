import { gql, useApolloClient } from "@apollo/client";
import { Alert, AsyncAutocompleteField, FinalForm } from "@comet/admin";
import { WarningSolid } from "@comet/admin-icons";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

import type { Manufacturer } from "../../../.storybook/mocks/handlers";
import { apolloStoryDecorator } from "../../apollo-story.decorator";

type Story = StoryObj<typeof AsyncAutocompleteField>;
const config: Meta<typeof AsyncAutocompleteField> = {
    component: AsyncAutocompleteField,
    title: "@comet/admin/form/AsyncAutocompleteField",
};
export default config;

const allOptions = [
    { label: "Marketing & Communications", value: "marketing" },
    { label: "Human Resources", value: "hr" },
    { label: "Software Development", value: "dev" },
    { label: "Product Management", value: "product" },
    { label: "Customer Support", value: "support" },
    { label: "Sales & Business Development", value: "sales" },
    { label: "Quality Assurance", value: "qa" },
    { label: "Research & Development", value: "rd" },
    { label: "Finance & Accounting", value: "finance" },
    { label: "Legal & Compliance", value: "legal" },
    { label: "Operations Management", value: "operations" },
    { label: "Data Analytics", value: "analytics" },
    { label: "User Experience Design", value: "ux" },
    { label: "Information Technology", value: "it" },
    { label: "Project Management", value: "pm" },
    { label: "Content Creation", value: "content" },
    { label: "Supply Chain Management", value: "supply" },
    { label: "Training & Development", value: "training" },
    { label: "Strategic Planning", value: "strategy" },
    { label: "Business Intelligence", value: "bi" },
];

/**
 * Simple example of using AsyncAutocompleteField with a list of options, where the options are loaded as objects.
 * The options are loaded asynchronously, simulating a network request.
 */
export const WithObjectOptions: Story = {
    render: () => {
        interface FormValues {
            department: {
                label: string;
                value: string;
            };
        }
        return (
            <FinalForm<FormValues>
                initialValues={{
                    department: allOptions[0],
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
                                loadOptions={async (search?: string) => {
                                    // Simulate network delay
                                    await new Promise((resolve) => setTimeout(resolve, 200));

                                    if (!search) {
                                        return allOptions;
                                    }

                                    const searchLower = search.toLowerCase();
                                    return allOptions.filter(
                                        (option) =>
                                            option.label.toLowerCase().includes(searchLower) || option.value.toLowerCase().includes(searchLower),
                                    );
                                }}
                                name="department"
                                label="Department"
                                fullWidth
                                variant="horizontal"
                                getOptionLabel={(option) => {
                                    return option.label;
                                }}
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

export const MultipleSelect: Story = {
    render: () => {
        interface FormValues {
            departments: {
                label: string;
                value: string;
            }[];
        }
        return (
            <FinalForm<FormValues>
                initialValues={{
                    departments: [allOptions[0]],
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
                                loadOptions={async (search?: string) => {
                                    // Simulate network delay
                                    await new Promise((resolve) => setTimeout(resolve, 200));

                                    if (!search) {
                                        return allOptions;
                                    }

                                    const searchLower = search.toLowerCase();
                                    return allOptions.filter(
                                        (option) =>
                                            option.label.toLowerCase().includes(searchLower) || option.value.toLowerCase().includes(searchLower),
                                    );
                                }}
                                name="departments"
                                label="Department"
                                fullWidth
                                variant="horizontal"
                                getOptionLabel={(option) => {
                                    return option.label;
                                }}
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

export const MultipleAutocompleteNoInitialValues: Story = {
    render: () => {
        interface FormValues {
            departments: {
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
                                loadOptions={async (search?: string) => {
                                    // Simulate network delay
                                    await new Promise((resolve) => setTimeout(resolve, 200));

                                    if (!search) {
                                        return allOptions;
                                    }

                                    const searchLower = search.toLowerCase();
                                    return allOptions.filter(
                                        (option) =>
                                            option.label.toLowerCase().includes(searchLower) || option.value.toLowerCase().includes(searchLower),
                                    );
                                }}
                                name="departments"
                                label="Department"
                                fullWidth
                                variant="horizontal"
                                getOptionLabel={(option) => {
                                    return option.label;
                                }}
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

export const LongLoading: Story = {
    render: () => {
        interface FormValues {
            department: {
                label: string;
                value: string;
            };
        }
        return (
            <FinalForm<FormValues>
                initialValues={{
                    department: allOptions[0],
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
                                loadOptions={async (search?: string) => {
                                    // Simulate network delay
                                    await new Promise((resolve) => setTimeout(resolve, 5000));

                                    if (!search) {
                                        return allOptions;
                                    }

                                    const searchLower = search.toLowerCase();
                                    return allOptions.filter(
                                        (option) =>
                                            option.label.toLowerCase().includes(searchLower) || option.value.toLowerCase().includes(searchLower),
                                    );
                                }}
                                name="department"
                                label="Department"
                                fullWidth
                                variant="horizontal"
                                getOptionLabel={(option) => {
                                    return option.label;
                                }}
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

export const AsyncAutocompleteLoadingDataFromApi: Story = {
    decorators: [apolloStoryDecorator("/graphql")],

    render: () => {
        const client = useApolloClient();

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
                                loadOptions={async (search) => {
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

                                    return data.manufacturers.map((manufacturer) => {
                                        return {
                                            value: manufacturer.id,
                                            label: manufacturer.name,
                                        };
                                    });
                                }}
                                name="manufacturer"
                                label="Manufacturer"
                                fullWidth
                                variant="horizontal"
                                getOptionLabel={(option) => {
                                    return option.label;
                                }}
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

export const ErrorLoadingOptions: Story = {
    render: () => {
        interface FormValues {
            department: {
                label: string;
                value: string;
            };
        }
        return (
            <FinalForm<FormValues>
                initialValues={{
                    department: allOptions[0],
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
                                loadOptions={async () => {
                                    // simulate loading
                                    await new Promise((resolve) => setTimeout(resolve, 500));
                                    throw Error("Error loading options");
                                }}
                                name="department"
                                label="Department"
                                fullWidth
                                variant="horizontal"
                                getOptionLabel={(option) => {
                                    return option.label;
                                }}
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

export const ErrorLoadingOptionsWithCustomErrorText: Story = {
    render: () => {
        interface FormValues {
            department: {
                label: string;
                value: string;
            };
        }
        return (
            <FinalForm<FormValues>
                initialValues={{
                    department: allOptions[0],
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
                                loadOptions={async () => {
                                    // simulate loading
                                    await new Promise((resolve) => setTimeout(resolve, 500));
                                    throw Error("Error loading options");
                                }}
                                name="department"
                                label="Department"
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
