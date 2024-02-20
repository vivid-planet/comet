import { Field, FormSection } from "@comet/admin";
import { FinalFormReactSelectStaticOptions } from "@comet/admin-react-select";
import { Card, CardContent } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry", isDisabled: true },
    { value: "vanilla", label: "Vanilla" },
    { value: "cherry", label: "Cherry" },
];

function Story() {
    return (
        <Card variant="outlined" style={{ width: 400 }}>
            <CardContent>
                <FormSection title="Final Form React Select Disabled Option" disableMarginBottom>
                    <Form
                        onSubmit={() => {
                            //
                        }}
                        render={({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <Field
                                    name="flavor"
                                    label="Flavor"
                                    component={FinalFormReactSelectStaticOptions}
                                    placeholder=""
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

storiesOf("@comet/admin-react-select", module).add("Final Form React Select Disabled Option", () => <Story />);
