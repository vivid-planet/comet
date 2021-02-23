import { Field, FieldContainer, FinalFormCheckbox, FinalFormInput, FinalFormRadio, FinalFormSelect, FinalFormSwitch } from "@comet/admin";
import { Button, FormControlLabel, MenuItem } from "@material-ui/core";
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
        <div style={{ width: "500px" }}>
            <Form
                onSubmit={(values) => {
                    alert(JSON.stringify(values, undefined, 2));
                }}
                initialValues={{ checkbox: false, radio: "foo", switch: false }}
                render={({ handleSubmit, values }) => (
                    <>
                        <div style={{ border: "solid 1px grey", padding: "20px" }}>
                            <form onSubmit={handleSubmit}>
                                <Field name="checkbox" label="FinalFormCheckbox" type="checkbox" component={FinalFormCheckbox} />
                                <Field name="input" label="FinalFormInput" component={FinalFormInput} />
                                <FieldContainer label="FinalFormRadio">
                                    <Field name="radio" type="radio" value="foo">
                                        {(props) => <FormControlLabel label="Foo" control={<FinalFormRadio {...props} />} />}
                                    </Field>
                                    <Field name="radio" type="radio" value="bar">
                                        {(props) => <FormControlLabel label="Bar" control={<FinalFormRadio {...props} />} />}
                                    </Field>
                                </FieldContainer>
                                <Field name="select" label="FinalFormSelect">
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
                                <Field name="switch" label="FinalFormSwitch" component={FinalFormSwitch} />
                                <Button color="primary" variant="contained" onClick={handleSubmit} style={{ marginTop: "20px" }}>
                                    Submit
                                </Button>
                            </form>
                        </div>
                        <div>
                            <pre>{JSON.stringify(values, undefined, 2)}</pre>
                        </div>
                    </>
                )}
            />
        </div>
    );
}

storiesOf("@comet/admin/form", module).add("AllFieldComponents", () => <Story />);
