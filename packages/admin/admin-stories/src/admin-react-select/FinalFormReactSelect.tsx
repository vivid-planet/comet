import { Field, FinalFormInput, FormSection } from "@comet/admin";
import { FinalFormReactSelectStaticOptions } from "@comet/admin-react-select";
import { Card, CardContent } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
];

function Story() {
    return (
        <Card variant="outlined" style={{ width: 400 }}>
            <CardContent>
                <FormSection title="Final Form React Select" disableMarginBottom>
                    <Form
                        onSubmit={() => {
                            //
                        }}
                        render={({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <Field name="name" label="Name" type="text" component={FinalFormInput} fullWidth />
                                <Field
                                    name="flavor"
                                    label="Flavor"
                                    component={FinalFormReactSelectStaticOptions}
                                    isClearable
                                    defaultOptions
                                    options={options}
                                    fullWidth
                                />
                            </form>
                        )}
                    />
                </FormSection>
            </CardContent>
        </Card>
    );
}

storiesOf("@comet/admin-react-select", module).add("Final Form React Select", () => <Story />);
