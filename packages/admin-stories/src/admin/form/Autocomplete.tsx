import { Field, FinalFormAutocomplete, FinalFormSelect, useAsyncOptionsProps } from "@comet/admin";
import { Button, Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
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

const initialValues = {
    autocomplete: options[1],
    autocompleteAsync: options[1],
    select: options[1],
    selectAsync: options[1],
};

function Story() {
    const acAsyncProps = useAsyncOptionsProps<Option>(async () => {
        return new Promise((resolve) => setTimeout(() => resolve(options), 500));
    });
    const selectAsyncProps = useAsyncOptionsProps<Option>(async () => {
        return new Promise((resolve) => setTimeout(() => resolve(options), 500));
    });
    return (
        <div style={{ maxWidth: "800px" }}>
            <p>
                FinalFormAutocomplete provides a select with a search field. It can also be used asynchronously with the useAsyncOptionsProps-Hook. It
                expects the value to be an object to be able to display the current value without having to load the async options.
            </p>
            <p>
                Furthermore FinalFormSelect can also be used like FinalFormAutocomplete (e.g. when no search field is needed). If an options-prop or
                the props from the useAsyncOptionsProps-Hook are passed FinalFormSelect automatically renders the options by itself and uses objects
                as values - just like Autocomplete.
            </p>
            <div style={{ width: "300px" }}>
                <Form
                    mode="edit"
                    onSubmit={(values) => {
                        alert(JSON.stringify(values, null, 4));
                    }}
                    initialValues={initialValues}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <Field component={FinalFormAutocomplete} options={options} name="autocomplete" label="Autocomplete" fullWidth />
                            <Field component={FinalFormAutocomplete} {...acAsyncProps} name="autocompleteAsync" label="AutocompleteAsync" fullWidth />
                            <Field component={FinalFormSelect} options={options} name="select" label="Select" fullWidth />
                            <Field component={FinalFormSelect} {...selectAsyncProps} name="selectAsync" label="SelectAsync" fullWidth />
                            <Button color="primary" variant="contained" type="submit" component="button" disableTouchRipple>
                                <Typography variant="button">Submit</Typography>
                            </Button>
                        </form>
                    )}
                />
            </div>
        </div>
    );
}

storiesOf("@comet/admin/form", module).add("Autocomplete", () => <Story />);
