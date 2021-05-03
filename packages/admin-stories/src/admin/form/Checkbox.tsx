import { Field, FieldContainer, FinalFormCheckbox } from "@comet/admin";
import { Grid } from "@material-ui/core";
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
                                    <Field name="unchecked" label="Unchecked" type="checkbox" component={FinalFormCheckbox} />
                                    <Field name="checked" label="Checked" type="checkbox" component={FinalFormCheckbox} />
                                    <Field name="disabledUnchecked" label="Disabled" disabled type="checkbox" component={FinalFormCheckbox} />
                                    <Field name="disabledChecked" label="Disabled & Checked" disabled type="checkbox" component={FinalFormCheckbox} />
                                </FieldContainer>
                            </Grid>
                            <Grid item xs={6}>
                                <FieldContainer label="Checkboxes with secondary color">
                                    <Field
                                        name="uncheckedSecondary"
                                        label="Unchecked"
                                        type="checkbox"
                                        component={FinalFormCheckbox}
                                        color={"secondary"}
                                    />
                                    <Field
                                        name="checkedSecondary"
                                        label="Checked"
                                        type="checkbox"
                                        component={FinalFormCheckbox}
                                        color={"secondary"}
                                    />
                                    <Field
                                        name="disabledUncheckedSecondary"
                                        label="Disabled"
                                        disabled
                                        type="checkbox"
                                        component={FinalFormCheckbox}
                                        color={"secondary"}
                                    />
                                    <Field
                                        name="disabledCheckedSecondary"
                                        label="Disabled & Checked"
                                        disabled
                                        type="checkbox"
                                        component={FinalFormCheckbox}
                                        color={"secondary"}
                                    />
                                </FieldContainer>{" "}
                            </Grid>
                        </Grid>
                    </form>
                )}
            />
        </div>
    );
}

storiesOf("@comet/admin/form", module).add("Checkbox", () => <Story />);
