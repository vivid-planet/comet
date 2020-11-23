import { Button, Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import { Autocomplete, Field, useAutocompleteAsyncProps } from "@comet/admin";
import * as React from "react";
import { Form } from "react-final-form";

interface IOption {
    id: string;
    label: string;
}

function Story() {
    const options: IOption[] = [
        { id: "chocolate", label: "Chocolate" },
        { id: "strawberry", label: "Strawberry" },
        { id: "vanilla", label: "Vanilla" },
    ];

    const autocompleteAsyncProps = useAutocompleteAsyncProps<IOption>(async () => {
        return new Promise((resolve) => setTimeout(() => resolve(options), 500));
    });

    return (
        <div style={{ width: "300px" }}>
            <Form
                mode="edit"
                onSubmit={(values) => {
                    alert(JSON.stringify(values));
                }}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Field name="flavor" label="Flavor" optionValue="id" optionLabel="label" component={Autocomplete} options={options} />
                        <Field
                            name="flavorAsync"
                            label="Flavor (async)"
                            getOptionSelected={(option: IOption, value: IOption) => option.id === value.id}
                            getOptionLabel={(option: IOption) => option.label}
                            component={Autocomplete}
                            {...autocompleteAsyncProps}
                        />
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
