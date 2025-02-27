import {
    Button,
    CheckboxField,
    Field,
    FieldContainer,
    FinalForm,
    FinalFormAsyncAutocomplete,
    FinalFormAsyncSelect,
    FinalFormAutocomplete,
    FinalFormInput,
    FinalFormRadio,
    FinalFormRangeInput,
    FinalFormSearchTextField,
    FinalFormSelect,
    SwitchField,
} from "@comet/admin";
import { FormControlLabel } from "@mui/material";
import { useMemo } from "react";

interface Option {
    value: string;
    label: string;
}

export default {
    title: "Docs/Form/Components/FinalForm Fields",
};

export const _FinalFormInput = {
    render: () => {
        return (
            <FinalForm
                mode="add"
                onSubmit={(values) => {
                    alert(JSON.stringify(values, null, 4));
                }}
            >
                <Field component={FinalFormInput} name="text" label="Text" placeholder="Some Text" fullWidth />
                <Field component={FinalFormInput} name="number" label="Number" type="number" placeholder="12" fullWidth />
                <Field component={FinalFormInput} name="email" label="Email" type="email" placeholder="john.doe@example.com" fullWidth />
                <Field component={FinalFormInput} name="password" label="Password" type="password" placeholder="Password" fullWidth />
                <Button type="submit">Submit</Button>
            </FinalForm>
        );
    },

    name: "FinalFormInput",
};

export const _FinalFormSearchTextField = {
    render: () => {
        return (
            <FinalForm
                mode="add"
                onSubmit={(values) => {
                    alert(JSON.stringify(values, null, 4));
                }}
            >
                <Field name="search" label="FinalFormSearchTextField" component={FinalFormSearchTextField} fullWidth />
                <Button type="submit">Submit</Button>
            </FinalForm>
        );
    },

    name: "FinalFormSearchTextField",
};

export const _FinalFormAutocomplete = {
    render: () => {
        const options: Option[] = [
            { value: "chocolate", label: "Chocolate" },
            { value: "strawberry", label: "Strawberry" },
            { value: "vanilla", label: "Vanilla" },
        ];

        const initialValues = useMemo(
            // Why useMemo()?
            // FinalForm reinitializes the form every time initalValues changes. A shallow equality check is used.
            // Therefore, without useMemo() FinalForm would reinitialize on every render.
            // for alternative approaches to prevent this behavior, see https://final-form.org/docs/react-final-form/types/FormProps#initialvaluesequal
            //
            // In a real life application, useMemo() is probably not necessary:
            // Case 1: the initial values are provided via GraphQL API => GraphQL handles the state => useMemo() not necessary
            // Case 2: the initial values are hardcoded => hardcode them outside of React Component => useMemo() not necessary
            () => ({
                autocomplete: { value: "strawberry", label: "Strawberry" },
                autocompleteAsync: { value: "strawberry", label: "Strawberry" },
                autocompleteMultiple: [{ value: "strawberry", label: "Strawberry" }],
            }),
            [],
        );

        return (
            <FinalForm
                mode="add"
                onSubmit={(values) => {
                    alert(JSON.stringify(values, null, 4));
                }}
                initialValues={initialValues}
            >
                <Field
                    component={FinalFormAutocomplete}
                    getOptionLabel={(option: Option) => option.label}
                    isOptionEqualToValue={(option: Option, value: Option) => option.value === value.value}
                    options={options}
                    name="autocomplete"
                    label="Autocomplete"
                    fullWidth
                />
                <Field
                    component={FinalFormAsyncAutocomplete}
                    loadOptions={async () => {
                        return new Promise((resolve) => setTimeout(() => resolve(options), 3000));
                    }}
                    getOptionLabel={(option: Option) => option.label}
                    isOptionEqualToValue={(option: Option, value: Option) => option.value === value.value}
                    name="autocompleteAsync"
                    label="AutocompleteAsync"
                    fullWidth
                />
                <Field
                    component={FinalFormAutocomplete}
                    multiple
                    getOptionLabel={(option: Option) => option.label}
                    isOptionEqualToValue={(option: Option, value: Option) => option.value === value.value}
                    options={options}
                    name="autocompleteMultiple"
                    label="Autocomplete multiple select"
                    fullWidth
                />
                <Button type="submit">Submit</Button>
            </FinalForm>
        );
    },

    name: "FinalFormAutocomplete",
};

export const _FinalFormSelect = {
    render: () => {
        const options: Option[] = [
            { value: "chocolate", label: "Chocolate" },
            { value: "strawberry", label: "Strawberry" },
            { value: "vanilla", label: "Vanilla" },
        ];

        const initialValues = useMemo(
            // Why useMemo()?
            // see "FinalFormAutocomplete" story
            () => ({
                select: { value: "strawberry", label: "Strawberry" },
                selectAsync: { value: "strawberry", label: "Strawberry" },
                selectMultiple: [{ value: "strawberry", label: "Strawberry" }],
            }),
            [],
        );

        return (
            <FinalForm
                mode="add"
                onSubmit={(values) => {
                    alert(JSON.stringify(values, null, 4));
                }}
                initialValues={initialValues}
            >
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
                    component={FinalFormAsyncSelect}
                    getOptionLabel={(option: Option) => option.label}
                    loadOptions={async () => {
                        return new Promise((resolve) => setTimeout(() => resolve(options), 500));
                    }}
                    name="selectAsync"
                    label="SelectAsync"
                    fullWidth
                />
                <Field
                    component={FinalFormSelect}
                    multiple
                    getOptionLabel={(option: Option) => option.label}
                    getOptionSelected={(option: Option, value: Option) => {
                        return option.value === value.value;
                    }}
                    options={options}
                    name="selectMultiple"
                    label="Select multiple values"
                    fullWidth
                />

                <Field
                    component={FinalFormSelect}
                    getOptionLabel={(option: Option) => option.label}
                    getOptionSelected={(option: Option, value: Option) => {
                        return option.value === value.value;
                    }}
                    options={options}
                    name="selectDisabled"
                    label="Select disabled"
                    fullWidth
                    disabled
                />

                <Button type="submit">Submit</Button>
            </FinalForm>
        );
    },

    name: "FinalFormSelect",
};

export const _FinalFormCheckbox = {
    render: () => {
        return (
            <FinalForm
                mode="add"
                onSubmit={(values) => {
                    alert(JSON.stringify(values, null, 4));
                }}
            >
                <CheckboxField name="checkbox" fieldLabel="FinalFormCheckbox" label="Confirm" fullWidth />
                <CheckboxField name="checkboxDisabled" fieldLabel="FinalFormCheckbox disabled" label="Confirm" fullWidth disabled />
                <Button type="submit">Submit</Button>
            </FinalForm>
        );
    },

    name: "FinalFormCheckbox",
};

export const _FinalFormSwitch = {
    render: () => {
        return (
            <FinalForm
                mode="add"
                onSubmit={(values) => {
                    alert(JSON.stringify(values, null, 4));
                }}
            >
                <SwitchField name="switch" fieldLabel="FinalFormSwitch" label={(checked) => (checked ? "On" : "Off")} fullWidth />
                <SwitchField
                    name="switchDisabled"
                    fieldLabel="FinalFormSwitch disabled"
                    label={(checked) => (checked ? "On" : "Off")}
                    fullWidth
                    disabled
                />
                <Button type="submit">Submit</Button>
            </FinalForm>
        );
    },

    name: "FinalFormSwitch",
};

export const _FinalFormRadio = {
    render: () => {
        return (
            <FinalForm
                mode="add"
                onSubmit={(values) => {
                    alert(JSON.stringify(values, null, 4));
                }}
            >
                <FieldContainer label="FinalFormRadio" fullWidth>
                    <Field name="radio" type="radio" value="option1">
                        {(props) => <FormControlLabel label="Option 1" control={<FinalFormRadio {...props} />} />}
                    </Field>
                    <Field name="radio" type="radio" value="option2">
                        {(props) => <FormControlLabel label="Option 2" control={<FinalFormRadio {...props} />} />}
                    </Field>
                </FieldContainer>
                <FieldContainer label="FinalFormRadio disabled" fullWidth disabled>
                    <Field name="radio" type="radio" value="disabledOption1" disabled>
                        {(props) => <FormControlLabel label="Disabled Option 1" control={<FinalFormRadio {...props} />} />}
                    </Field>
                    <Field name="radio" type="radio" value="disabledOption2" disabled>
                        {(props) => <FormControlLabel label="Disabled Option 2" control={<FinalFormRadio {...props} />} />}
                    </Field>
                </FieldContainer>
                <Button type="submit">Submit</Button>
            </FinalForm>
        );
    },

    name: "FinalFormRadio",
};

export const _FinalFormRangeInput = {
    render: () => {
        return (
            <FinalForm
                mode="add"
                onSubmit={(values) => {
                    alert(JSON.stringify(values, null, 4));
                }}
            >
                <Field name="price" label="FinalFormRangeInput" component={FinalFormRangeInput} startAdornment="€" fullWidth min={50} max={1000} />
                <Button type="submit">Submit</Button>
            </FinalForm>
        );
    },

    name: "FinalFormRangeInput",
};
