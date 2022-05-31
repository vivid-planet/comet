import { Field, FinalForm, FinalFormAutocomplete, useAsyncOptionsProps } from "@comet/admin";
import { Button } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { apolloStoryDecorator } from "../../../apollo-story.decorator";

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
    autocomplete: { value: "strawberry", label: "Strawberry" },
    autocompleteAsync: { value: "strawberry", label: "Strawberry" },
};

storiesOf("stories/form/Custom Fields", module)
    .addDecorator(apolloStoryDecorator())
    .add("FinalFormAutocomplete", () => {
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
    });
