import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { SaveButton } from "../../../common/buttons/SaveButton";
import { FinalForm } from "../../../FinalForm";
import { FinalFormDebug } from "../../../form/FinalFormDebug";
import { AsyncAutocompleteField } from "../AsyncAutocompleteField";
import { TextField } from "../TextField";

type Story = StoryObj<typeof AsyncAutocompleteField>;
const config: Meta<typeof AsyncAutocompleteField> = {
    component: AsyncAutocompleteField,
    title: "components/form/AsyncAutocompleteField",
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
        interface FormValues {
            department: {
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
 *
 * Use this when:
 * - Users can select multiple options from the list
 * - You need to store an array of selected values
 */
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
 *
 * Use this when:
 * - Multiple selections are allowed but at least one is required
 * - You need to validate that the array is not empty
 */
export const MultipleWithRequired: Story = {
    render: () => {
        interface FormValues {
            anotherField: string;
            departments: {
                label: string;
                value: string;
            }[];
        }
        return (
            <FinalForm<FormValues>
                initialValues={{
                    departments: [],
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
 *
 * Use this when:
 * - The form starts with no selections
 * - Users build their selection from scratch
 */
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
 *
 * Use this when:
 * - Testing loading behavior
 * - You want to show how the component handles slow network requests
 */
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
 *
 * Use this when:
 * - Demonstrating error handling
 * - Testing how the component displays loading errors
 */
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

                            <FinalFormDebug />
                        </>
                    );
                }}
            </FinalForm>
        );
    },
};
