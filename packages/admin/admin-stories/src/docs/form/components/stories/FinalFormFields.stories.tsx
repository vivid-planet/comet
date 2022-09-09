import {
    Field,
    FieldContainer,
    FinalForm,
    FinalFormAutocomplete,
    FinalFormCheckbox,
    FinalFormInput,
    FinalFormRadio,
    FinalFormRangeInput,
    FinalFormSearchTextField,
    FinalFormSelect,
    FinalFormSwitch,
    useAsyncOptionsProps,
} from "@comet/admin";
import { Button, FormControlLabel } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { apolloStoryDecorator } from "../../../../apollo-story.decorator";

interface Option {
    value: string;
    label: string;
}

storiesOf("stories/form/FinalForm Fields", module)
    .addDecorator(apolloStoryDecorator())
    .add("FinalFormInput", () => {
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
                <Button color="primary" variant="contained" type="submit">
                    Submit
                </Button>
            </FinalForm>
        );
    })
    .add("FinalFormSearchTextField", () => {
        return (
            <FinalForm
                mode="add"
                onSubmit={(values) => {
                    alert(JSON.stringify(values, null, 4));
                }}
            >
                <Field name="search" label="FinalFormSearchTextField" component={FinalFormSearchTextField} fullWidth />
                <Button color="primary" variant="contained" type="submit">
                    Submit
                </Button>
            </FinalForm>
        );
    })
    .add("FinalFormAutocomplete", () => {
        const options: Option[] = [
            { value: "chocolate", label: "Chocolate" },
            { value: "strawberry", label: "Strawberry" },
            { value: "vanilla", label: "Vanilla" },
        ];

        const initialValues = React.useMemo(
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
            }),
            [],
        );

        const acAsyncProps = useAsyncOptionsProps<Option>(async () => {
            return new Promise((resolve) => setTimeout(() => resolve(options), 3000));
        });

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
                <Button color="primary" variant="contained" type="submit">
                    Submit
                </Button>
            </FinalForm>
        );
    })
    .add("FinalFormSelect", () => {
        const options: Option[] = [
            { value: "chocolate", label: "Chocolate" },
            { value: "strawberry", label: "Strawberry" },
            { value: "vanilla", label: "Vanilla" },
        ];

        const initialValues = React.useMemo(
            // Why useMemo()?
            // see "FinalFormAutocomplete" story
            () => ({
                select: { value: "strawberry", label: "Strawberry" },
                selectAsync: { value: "strawberry", label: "Strawberry" },
            }),
            [],
        );

        const selectAsyncProps = useAsyncOptionsProps<Option>(async () => {
            return new Promise((resolve) => setTimeout(() => resolve(options), 500));
        });

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
                <Button color="primary" variant="contained" type="submit">
                    Submit
                </Button>
            </FinalForm>
        );
    })
    .add("FinalFormCheckbox", () => {
        return (
            <FinalForm
                mode="add"
                onSubmit={(values) => {
                    alert(JSON.stringify(values, null, 4));
                }}
            >
                <Field name="checkbox" label="FinalFormCheckbox" type="checkbox" fullWidth>
                    {(props) => <FormControlLabel label="Confirm" control={<FinalFormCheckbox {...props} />} />}
                </Field>
                <Button color="primary" variant="contained" type="submit">
                    Submit
                </Button>
            </FinalForm>
        );
    })
    .add("FinalFormSwitch", () => {
        return (
            <FinalForm
                mode="add"
                onSubmit={(values) => {
                    alert(JSON.stringify(values, null, 4));
                }}
            >
                <Field name="switch" label="FinalFormSwitch" fullWidth>
                    {(props) => <FormControlLabel label={props.input.value ? "On" : "Off"} control={<FinalFormSwitch {...props} />} />}
                </Field>
                <Button color="primary" variant="contained" type="submit">
                    Submit
                </Button>
            </FinalForm>
        );
    })
    .add("FinalFormRadio", () => {
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
                <Button color="primary" variant="contained" type="submit">
                    Submit
                </Button>
            </FinalForm>
        );
    })
    .add("FinalFormRangeInput", () => {
        return (
            <FinalForm
                mode="add"
                onSubmit={(values) => {
                    alert(JSON.stringify(values, null, 4));
                }}
            >
                <Field name="price" label="FinalFormRangeInput" component={FinalFormRangeInput} startAdornment="€" fullWidth min={50} max={1000} />
                <Button color="primary" variant="contained" type="submit">
                    Submit
                </Button>
            </FinalForm>
        );
    });
