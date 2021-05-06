import { Field, FieldContainer, FinalFormCheckbox } from "@comet/admin";
import { FormControlLabel, Grid } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

function Story() {
    return (
        <div style={{ width: 500 }}>
            <Form
                initialValues={{
                    unchecked: false,
                    checked: true,
                    disabledUnchecked: false,
                    disabledChecked: true,
                    uncheckedSecondary: false,
                    checkedSecondary: true,
                    disabledUncheckedSecondary: false,
                    disabledCheckedSecondary: true,
                }}
                onSubmit={(values) => {
                    //
                }}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Grid container>
                            <Grid item xs={6}>
                                <FieldContainer label="Checkboxes">
                                    <Field name="unchecked" type="checkbox">
                                        {(props) => <FormControlLabel label="Unchecked" control={<FinalFormCheckbox {...props} />} />}
                                    </Field>
                                    <Field name="checked" type="checkbox">
                                        {(props) => <FormControlLabel label="Checked" control={<FinalFormCheckbox {...props} />} />}
                                    </Field>
                                    <Field name="disabledUnchecked" type="checkbox">
                                        {(props) => <FormControlLabel label="Disabled" disabled control={<FinalFormCheckbox {...props} />} />}
                                    </Field>
                                    <Field name="disabledChecked" type="checkbox">
                                        {(props) => (
                                            <FormControlLabel label="Disabled & Checked" disabled control={<FinalFormCheckbox {...props} />} />
                                        )}
                                    </Field>
                                </FieldContainer>
                            </Grid>
                            <Grid item xs={6}>
                                <FieldContainer label="Checkboxes with secondary color">
                                    <Field name="uncheckedSecondary" type="checkbox">
                                        {(props) => (
                                            <FormControlLabel label="Unchecked" control={<FinalFormCheckbox {...props} color="secondary" />} />
                                        )}
                                    </Field>
                                    <Field name="checkedSecondary" type="checkbox">
                                        {(props) => <FormControlLabel label="Checked" control={<FinalFormCheckbox {...props} color="secondary" />} />}
                                    </Field>
                                    <Field name="disabledUncheckedSecondary" type="checkbox">
                                        {(props) => (
                                            <FormControlLabel
                                                label="Disabled"
                                                control={<FinalFormCheckbox {...props} color="secondary" />}
                                                disabled
                                            />
                                        )}
                                    </Field>
                                    <Field name="disabledCheckedSecondary" type="checkbox">
                                        {(props) => (
                                            <FormControlLabel
                                                label="Disabled & Checked"
                                                control={<FinalFormCheckbox {...props} color="secondary" />}
                                                disabled
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

storiesOf("@comet/admin/form", module).add("Checkbox", () => <Story />);
