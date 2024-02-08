import { Field, FieldContainer, FinalFormRadio } from "@comet/admin";
import { Card, CardContent, FormControlLabel, Grid } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

function Story() {
    return (
        <div style={{ width: 600 }}>
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
                        <Grid container spacing={4}>
                            <Grid item xs={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <FieldContainer label="Radios">
                                            <Field name="foo1" type="radio" value="bar1" fullWidth>
                                                {(props) => <FormControlLabel label="Unchecked" control={<FinalFormRadio {...props} />} />}
                                            </Field>
                                            <Field name="foo1" type="radio" value="bar2" fullWidth>
                                                {(props) => <FormControlLabel label="Checked" control={<FinalFormRadio {...props} />} />}
                                            </Field>
                                            <Field name="foo2" type="radio" value="bar1" fullWidth>
                                                {(props) => <FormControlLabel label="Disabled" disabled control={<FinalFormRadio {...props} />} />}
                                            </Field>
                                            <Field name="foo2" type="radio" value="bar2" fullWidth>
                                                {(props) => (
                                                    <FormControlLabel label="Disabled & Checked" disabled control={<FinalFormRadio {...props} />} />
                                                )}
                                            </Field>
                                        </FieldContainer>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <FieldContainer label="Radios with secondary color">
                                            <Field name="foo3" type="radio" value="bar1" fullWidth>
                                                {(props) => (
                                                    <FormControlLabel label="Unchecked" control={<FinalFormRadio {...props} color="secondary" />} />
                                                )}
                                            </Field>
                                            <Field name="foo3" type="radio" value="bar2" fullWidth>
                                                {(props) => (
                                                    <FormControlLabel label="Checked" control={<FinalFormRadio {...props} color="secondary" />} />
                                                )}
                                            </Field>
                                            <Field name="foo4" type="radio" value="bar1" fullWidth>
                                                {(props) => (
                                                    <FormControlLabel
                                                        label="Disabled"
                                                        disabled
                                                        control={<FinalFormRadio {...props} color="secondary" />}
                                                    />
                                                )}
                                            </Field>
                                            <Field name="foo4" type="radio" value="bar2" fullWidth>
                                                {(props) => (
                                                    <FormControlLabel
                                                        label="Disabled & Checked"
                                                        disabled
                                                        control={<FinalFormRadio {...props} color="secondary" />}
                                                    />
                                                )}
                                            </Field>
                                        </FieldContainer>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </form>
                )}
            />
        </div>
    );
}

storiesOf("@comet/admin/form", module).add("Radio", () => <Story />);
