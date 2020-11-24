import { Button, Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import { Autocomplete, Field, useAutocompleteAsyncProps } from "@comet/admin";
import * as React from "react";
import { Form } from "react-final-form";

interface IOption {
    id: string;
    label: string;
}

const options: IOption[] = [
    { id: "chocolate", label: "Chocolate" },
    { id: "strawberry", label: "Strawberry" },
    { id: "vanilla", label: "Vanilla" },
];

const AutocompleteField = () => {
    return <Field name="flavor" label="Flavor" optionValue="id" optionLabel="label" component={Autocomplete} options={options} />;
};

const AutocompleteAsyncField = () => {
    const autocompleteAsyncProps = useAutocompleteAsyncProps<IOption>(async () => {
        return new Promise((resolve) => setTimeout(() => resolve(options), 500));
    });
    return (
        <Field
            name="flavorAsync"
            label="Flavor (async)"
            getOptionSelected={(option: IOption, value: IOption) => option.id === value.id}
            getOptionLabel={(option: IOption) => option.label}
            component={Autocomplete}
            {...autocompleteAsyncProps}
        />
    );
};

function Story() {
    return (
        <div style={{ width: "300px" }}>
            <Form
                mode="edit"
                onSubmit={(values) => {
                    alert(JSON.stringify(values));
                }}
                initialValues={{
                    flavor: options[0],
                    flavorAsync: options[1],
                }}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <AutocompleteField />
                        <AutocompleteAsyncField />
                        <Button color="primary" variant="contained" type="submit" component="button" disableTouchRipple>
                            <Typography variant="button">Submit</Typography>
                        </Button>
                    </form>
                )}
            />
        </div>
    );
}

storiesOf("@comet/admin/form", module).add("Autocomplete", () => <Story />);
