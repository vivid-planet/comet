import { Field, FinalFormSelect, FormPaper } from "@comet/admin";
import { MenuItem } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

function Story() {
    const options = [
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry" },
        { value: "vanilla", label: "Vanilla" },
    ];
    return (
        <div style={{ width: 350 }}>
            <Form
                onSubmit={(values) => {
                    //
                }}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <FormPaper variant="outlined">
                            <Field name="flavor" label="Flavor">
                                {(props) => (
                                    <FinalFormSelect {...props}>
                                        {options.map((option) => (
                                            <MenuItem value={option.value} key={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </FinalFormSelect>
                                )}
                            </Field>

                            <Field name="flavorFullWidth" label="Flavor">
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

                            <Field name="flavorRequired" label="Flavor">
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

                            <Field name="flavorDisabled" label="Flavor">
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
                        </FormPaper>
                    </form>
                )}
            />
        </div>
    );
}

storiesOf("@comet/admin/form", module).add("Select", () => <Story />);
