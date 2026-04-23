import { Button, Field, FinalFormAutocomplete, FinalFormSelect, useAsyncOptionsProps } from "@comet/admin";
import { Form } from "react-final-form";

interface Option {
    value: string;
    label: string;
}

const options: Option[] = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
];

const longLabelOptions: Option[] = [
    { value: "long-1", label: "Supercalifragilisticexpialidocious Chocolate Ice Cream" },
    { value: "long-2", label: "Extraordinarily Delicious Strawberry Shortcake" },
    { value: "long-3", label: "Vanilla" },
];

const manyOptions: Option[] = [
    { value: "a", label: "Apple" },
    { value: "b", label: "Banana" },
    { value: "c", label: "Cherry" },
    { value: "d", label: "Date" },
    { value: "e", label: "Elderberry" },
    { value: "f", label: "Fig" },
    { value: "g", label: "Grape" },
    { value: "h", label: "Honeydew" },
];

const initialValues = {
    autocomplete: { value: "strawberry", label: "Strawberry" },
    autocompleteAsync: { value: "strawberry", label: "Strawberry" },
    select: { value: "strawberry", label: "Strawberry" },
    selectAsync: { value: "strawberry", label: "Strawberry" },
    selectAsyncMultiple: [
        { value: "strawberry", label: "Strawberry" },
        { value: "chocolate", label: "Chocolate" },
    ],
};

export default {
    title: "@comet/admin/form",
};

export const AutocompleteAsyncSelect = {
    render: () => {
        const acAsyncProps = useAsyncOptionsProps<Option>(async () => {
            return new Promise((resolve) => setTimeout(() => resolve(options), 500));
        });
        const selectAsyncProps = useAsyncOptionsProps<Option>(async () => {
            return new Promise((resolve) => setTimeout(() => resolve(options), 500));
        });
        const selectAsyncMultipleProps = useAsyncOptionsProps<Option>(async () => {
            return new Promise((resolve) => setTimeout(() => resolve(options), 500));
        });
        return (
            <div style={{ maxWidth: "800px" }}>
                <p>
                    FinalFormAutocomplete provides a select with a search field. It can also be used asynchronously with the
                    useAsyncOptionsProps-Hook. It expects the value to be an object to be able to display the current value without having to load the
                    async options.
                </p>
                <p>Furthermore FinalFormSelect can also be used like FinalFormAutocomplete (e.g. when no search field is needed).</p>
                <div style={{ width: "300px" }}>
                    <Form
                        mode="edit"
                        onSubmit={(values) => {
                            alert(JSON.stringify(values, null, 4));
                        }}
                        initialValues={initialValues}
                        render={({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <Field
                                    component={FinalFormAutocomplete}
                                    getOptionLabel={(option: Option) => option.label}
                                    getOptionSelected={(option: Option, value: Option) => {
                                        return option.value === value.value;
                                    }}
                                    options={options}
                                    name="autocomplete"
                                    label="Autocomplete"
                                    fullWidth
                                />
                                <Field
                                    component={FinalFormAutocomplete}
                                    {...acAsyncProps}
                                    getOptionLabel={(option: Option) => option.label}
                                    getOptionSelected={(option: Option, value: Option) => {
                                        return option.value === value.value;
                                    }}
                                    name="autocompleteAsync"
                                    label="AutocompleteAsync"
                                    fullWidth
                                />
                                <Field
                                    component={FinalFormSelect}
                                    getOptionLabel={(option: Option) => option.label}
                                    getOptionSelected={(option: Option, value: Option) => {
                                        return option.value === value.value;
                                    }}
                                    options={options}
                                    name="select"
                                    label="Select"
                                    fullWidth
                                />
                                <Field
                                    component={FinalFormSelect}
                                    getOptionLabel={(option: Option) => option.label}
                                    getOptionSelected={(option: Option, value: Option) => {
                                        return option.value === value.value;
                                    }}
                                    {...selectAsyncProps}
                                    name="selectAsync"
                                    label="SelectAsync"
                                    fullWidth
                                />
                                <Field
                                    component={FinalFormSelect}
                                    getOptionLabel={(option: Option) => option.label}
                                    getOptionSelected={(option: Option, value: Option) => {
                                        return option.value === value.value;
                                    }}
                                    {...selectAsyncMultipleProps}
                                    name="selectAsyncMultiple"
                                    label="SelectAsyncMultiple"
                                    multiple
                                    fullWidth
                                />
                                <Button type="submit">Submit</Button>
                            </form>
                        )}
                    />
                </div>
            </div>
        );
    },

    name: "Autocomplete / Async Select",
};

/**
 * Regression cases for the end-adornment (clear button + popup icon) being pushed
 * below chips in multi-select Autocomplete when chips fill the input row.
 *
 * In each case, the clear button (×) and the dropdown chevron MUST stay on the input row
 * (not wrap below the chips) even in a narrow container.
 */
export const MultiSelectEndAdornmentWrapping = {
    render: () => {
        return (
            <div style={{ width: "300px", display: "flex", flexDirection: "column", gap: 24 }}>
                <div>
                    <strong>Case 1: One long chip</strong>
                    <Form
                        mode="edit"
                        onSubmit={() => undefined}
                        initialValues={{
                            field: [longLabelOptions[0]],
                        }}
                        render={() => (
                            <Field
                                component={FinalFormAutocomplete}
                                multiple
                                getOptionLabel={(option: Option) => option.label}
                                isOptionEqualToValue={(option: Option, value: Option) => option.value === value.value}
                                options={longLabelOptions}
                                name="field"
                                label="One long chip"
                                fullWidth
                            />
                        )}
                    />
                </div>

                <div>
                    <strong>Case 2: Multiple small chips filling the row</strong>
                    <Form
                        mode="edit"
                        onSubmit={() => undefined}
                        initialValues={{
                            field: [options[0], options[1], options[2]],
                        }}
                        render={() => (
                            <Field
                                component={FinalFormAutocomplete}
                                multiple
                                getOptionLabel={(option: Option) => option.label}
                                isOptionEqualToValue={(option: Option, value: Option) => option.value === value.value}
                                options={options}
                                name="field"
                                label="Three small chips"
                                fullWidth
                            />
                        )}
                    />
                </div>

                <div>
                    <strong>Case 3: Many chips wrapping to several rows</strong>
                    <Form
                        mode="edit"
                        onSubmit={() => undefined}
                        initialValues={{
                            field: manyOptions,
                        }}
                        render={() => (
                            <Field
                                component={FinalFormAutocomplete}
                                multiple
                                getOptionLabel={(option: Option) => option.label}
                                isOptionEqualToValue={(option: Option, value: Option) => option.value === value.value}
                                options={manyOptions}
                                name="field"
                                label="Many chips"
                                fullWidth
                            />
                        )}
                    />
                </div>

                <div>
                    <strong>Case 4: Mixed long + short chip</strong>
                    <Form
                        mode="edit"
                        onSubmit={() => undefined}
                        initialValues={{
                            field: [longLabelOptions[0], longLabelOptions[2]],
                        }}
                        render={() => (
                            <Field
                                component={FinalFormAutocomplete}
                                multiple
                                getOptionLabel={(option: Option) => option.label}
                                isOptionEqualToValue={(option: Option, value: Option) => option.value === value.value}
                                options={longLabelOptions}
                                name="field"
                                label="Long + short"
                                fullWidth
                            />
                        )}
                    />
                </div>

                <div>
                    <strong>Case 5: Required (no clear button) with long chip</strong>
                    <Form
                        mode="edit"
                        onSubmit={() => undefined}
                        initialValues={{
                            field: [longLabelOptions[0]],
                        }}
                        render={() => (
                            <Field
                                component={FinalFormAutocomplete}
                                multiple
                                required
                                getOptionLabel={(option: Option) => option.label}
                                isOptionEqualToValue={(option: Option, value: Option) => option.value === value.value}
                                options={longLabelOptions}
                                name="field"
                                label="Required, long chip"
                                fullWidth
                            />
                        )}
                    />
                </div>

                <div>
                    <strong>Case 6: Empty (no chips, no clear)</strong>
                    <Form
                        mode="edit"
                        onSubmit={() => undefined}
                        render={() => (
                            <Field
                                component={FinalFormAutocomplete}
                                multiple
                                getOptionLabel={(option: Option) => option.label}
                                isOptionEqualToValue={(option: Option, value: Option) => option.value === value.value}
                                options={options}
                                name="field"
                                label="Empty"
                                fullWidth
                            />
                        )}
                    />
                </div>

                <div>
                    <strong>Case 7: Single-select with long value</strong>
                    <Form
                        mode="edit"
                        onSubmit={() => undefined}
                        initialValues={{
                            field: longLabelOptions[0],
                        }}
                        render={() => (
                            <Field
                                component={FinalFormAutocomplete}
                                getOptionLabel={(option: Option) => option.label}
                                isOptionEqualToValue={(option: Option, value: Option) => option.value === value.value}
                                options={longLabelOptions}
                                name="field"
                                label="Single-select, long value"
                                fullWidth
                            />
                        )}
                    />
                </div>

                <div>
                    <strong>Case 8: All end-adornment slots populated (loading + error + clear + popup)</strong>
                    <Form
                        mode="edit"
                        onSubmit={() => undefined}
                        initialValues={{
                            field: [options[0], options[1], options[2]],
                        }}
                        render={() => (
                            <Field
                                component={FinalFormAutocomplete}
                                multiple
                                // Force all 4 end-adornment children to render together:
                                loading
                                loadingError
                                getOptionLabel={(option: Option) => option.label}
                                isOptionEqualToValue={(option: Option, value: Option) => option.value === value.value}
                                options={options}
                                name="field"
                                label="Loading + error + clear + popup"
                                fullWidth
                            />
                        )}
                    />
                </div>

                <Button type="submit">Submit</Button>
            </div>
        );
    },

    name: "Autocomplete / End-adornment wrapping (regression)",
};
