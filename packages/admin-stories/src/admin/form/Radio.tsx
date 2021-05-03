import { Field, FieldContainer, FinalFormRadio } from "@comet/admin";
import { Grid } from "@material-ui/core";
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
                                    <Field name="foo1" value="bar1" label="Unchecked" type="radio" component={FinalFormRadio} />
                                    <Field name="foo1" value="bar2" label="Checked" type="radio" component={FinalFormRadio} />
                                    <Field name="foo2" value="bar1" label="Disabled" disabled type="radio" component={FinalFormRadio} />
                                    <Field name="foo2" value="bar2" label="Disabled & Checked" disabled type="radio" component={FinalFormRadio} />
                                </FieldContainer>
                            </Grid>
                            <Grid item xs={6}>
                                <FieldContainer label="Radios with secondary color">
                                    <Field name="foo3" value="bar1" label="Unchecked" type="radio" component={FinalFormRadio} color="secondary" />
                                    <Field name="foo3" value="bar2" label="Checked" type="radio" component={FinalFormRadio} color="secondary" />
                                    <Field
                                        name="foo4"
                                        value="bar1"
                                        label="Disabled"
                                        disabled
                                        type="radio"
                                        component={FinalFormRadio}
                                        color="secondary"
                                    />
                                    <Field
                                        name="foo4"
                                        value="bar2"
                                        label="Disabled & Checked"
                                        disabled
                                        type="radio"
                                        component={FinalFormRadio}
                                        color="secondary"
                                    />
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
