import { Field, FinalFormSelect } from "@comet/admin";
import { Card, CardContent, MenuItem } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

function Story() {
    interface Option {
        value: string;
        label: string;
    }
    const options: Option[] = [
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry" },
        { value: "vanilla", label: "Vanilla" },
    ];
    return (
        <div style={{ maxWidth: "800px" }}>
            <p>
                If an options-prop or the props from the useAsyncOptionsProps-Hook are passed, FinalFormSelect automatically renders the options by
                itself and uses objects as values.
            </p>
            <div style={{ width: 350 }}>
                <Form
                    onSubmit={(values) => {
                        //
                    }}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Field name="flavor" label="Flavor" fullWidth>
                                        {(props) => (
                                            <FinalFormSelect {...props} fullWidth>
                                                {options.map((option: Option) => (
                                                    <MenuItem value={option.value} key={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </FinalFormSelect>
                                        )}
                                    </Field>

                                    <Field name="flavorOptions" label="Flavor with Options as prop" fullWidth>
                                        {(props) => (
                                            <FinalFormSelect
                                                {...props}
                                                options={options}
                                                getOptionLabel={(option: Option) => option.label}
                                                getOptionSelected={(option: Option, value: Option) => option.value === value.value}
                                                fullWidth
                                            />
                                        )}
                                    </Field>

                                    <Field name="flavorFullWidth" label="Flavor" fullWidth>
                                        {(props) => (
                                            <FinalFormSelect {...props} fullWidth>
                                                {options.map((option) => (
                                                    <MenuItem value={option.value} key={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </FinalFormSelect>
                                        )}
                                    </Field>

                                    <Field name="flavorRequired" label="Flavor" fullWidth>
                                        {(props) => (
                                            <FinalFormSelect {...props} fullWidth required>
                                                {options.map((option) => (
                                                    <MenuItem value={option.value} key={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </FinalFormSelect>
                                        )}
                                    </Field>

                                    <Field name="flavorDisabled" label="Flavor" fullWidth>
                                        {(props) => (
                                            <FinalFormSelect {...props} fullWidth disabled>
                                                {options.map((option) => (
                                                    <MenuItem value={option.value} key={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </FinalFormSelect>
                                        )}
                                    </Field>
                                </CardContent>
                            </Card>
                        </form>
                    )}
                />
            </div>
        </div>
    );
}

storiesOf("@comet/admin/form", module).add("Select", () => <Story />);
