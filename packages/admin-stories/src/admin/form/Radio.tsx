import { Field, FieldContainer, FinalFormRadio } from "@comet/admin";
import { FormControlLabel, Grid } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

function Story() {
    return (
        <div style={{ width: 500 }}>
            <Form
                initialValues={{
                    foo1: "bar2",
                    foo2: "bar2",
                    foo3: "bar2",
                    foo4: "bar2",
                }}
                onSubmit={(values) => {
                    //
                }}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Grid container>
                            <Grid item xs={6}>
                                <FieldContainer label="Radios">
                                    <Field name="foo1" type="radio" value="bar1">
                                        {(props) => <FormControlLabel label="Unchecked" control={<FinalFormRadio {...props} />} />}
                                    </Field>
                                    <Field name="foo1" type="radio" value="bar2">
                                        {(props) => <FormControlLabel label="Checked" control={<FinalFormRadio {...props} />} />}
                                    </Field>
                                    <Field name="foo2" type="radio" value="bar1">
                                        {(props) => <FormControlLabel label="Disabled" disabled control={<FinalFormRadio {...props} />} />}
                                    </Field>
                                    <Field name="foo2" type="radio" value="bar2">
                                        {(props) => <FormControlLabel label="Disabled & Checked" disabled control={<FinalFormRadio {...props} />} />}
                                    </Field>
                                </FieldContainer>
                            </Grid>
                            <Grid item xs={6}>
                                <FieldContainer label="Radios with secondary color">
                                    <Field name="foo3" type="radio" value="bar1">
                                        {(props) => <FormControlLabel label="Unchecked" control={<FinalFormRadio {...props} color="secondary" />} />}
                                    </Field>
                                    <Field name="foo3" type="radio" value="bar2">
                                        {(props) => <FormControlLabel label="Checked" control={<FinalFormRadio {...props} color="secondary" />} />}
                                    </Field>
                                    <Field name="foo4" type="radio" value="bar1">
                                        {(props) => (
                                            <FormControlLabel label="Disabled" disabled control={<FinalFormRadio {...props} color="secondary" />} />
                                        )}
                                    </Field>
                                    <Field name="foo4" type="radio" value="bar2">
                                        {(props) => (
                                            <FormControlLabel
                                                label="Disabled & Checked"
                                                disabled
                                                control={<FinalFormRadio {...props} color="secondary" />}
                                            />
                                        )}
                                    </Field>
                                </FieldContainer>
                            </Grid>
                        </Grid>
                    </form>
                )}
            />
        </div>
    );
}

storiesOf("@comet/admin/form", module).add("Radio", () => <Story />);
