import {
    Field,
    FieldContainer,
    FinalFormCheckbox,
    FinalFormInput,
    FinalFormRadio,
    FinalFormSearchTextField,
    FinalFormSelect,
    FinalFormSwitch,
} from "@comet/admin";
import { Button, Card, CardContent, FormControlLabel, MenuItem } from "@mui/material";
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
                        <Card variant="outlined">
                            <CardContent>
                                <form onSubmit={handleSubmit}>
                                    <Field name="input" label="FinalFormInput" fullWidth component={FinalFormInput} />
                                    <Field name="search" label="FinalFormSearchTextField" component={FinalFormSearchTextField} />
                                    <Field
                                        name="text"
                                        label="FinalFormInput (multiline)"
                                        multiline
                                        rows={3}
                                        rowsMax={5}
                                        fullWidth
                                        component={FinalFormInput}
                                    />
                                    <Field name="checkbox" type="checkbox" fullWidth>
                                        {(props) => <FormControlLabel label="FinalFormCheckbox" control={<FinalFormCheckbox {...props} />} />}
                                    </Field>
                                    <FieldContainer label="FinalFormRadio" fullWidth>
                                        <Field name="radio" type="radio" value="foo">
                                            {(props) => <FormControlLabel label="Foo" control={<FinalFormRadio {...props} />} />}
                                        </Field>
                                        <Field name="radio" type="radio" value="bar">
                                            {(props) => <FormControlLabel label="Bar" control={<FinalFormRadio {...props} />} />}
                                        </Field>
                                    </FieldContainer>
                                    <Field name="select" label="FinalFormSelect" fullWidth>
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
                                    <Field name="switch" label="FinalFormSwitch" fullWidth>
                                        {(props) => (
                                            <FormControlLabel label={values.switch ? "On" : "Off"} control={<FinalFormSwitch {...props} />} />
                                        )}
                                    </Field>
                                    <Button color="primary" variant="contained" onClick={handleSubmit}>
                                        Submit
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
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
