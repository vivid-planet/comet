import { Field, FieldContainer, FinalFormCheckbox } from "@comet/admin";
import { Card, CardContent, FormControlLabel, Grid } from "@mui/material";
import * as React from "react";
import { Form } from "react-final-form";

export default {
    title: "@comet/admin/form",
};

export const Checkbox = () => {
    return (
        <div style={{ width: 600 }}>
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
                        <Grid container spacing={4}>
                            <Grid item xs={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <FieldContainer label="Checkboxes">
                                            <Field name="unchecked" type="checkbox" fullWidth>
                                                {(props) => <FormControlLabel label="Unchecked" control={<FinalFormCheckbox {...props} />} />}
                                            </Field>
                                            <Field name="checked" type="checkbox" fullWidth>
                                                {(props) => <FormControlLabel label="Checked" control={<FinalFormCheckbox {...props} />} />}
                                            </Field>
                                            <Field name="disabledUnchecked" type="checkbox" fullWidth disabled>
                                                {(props) => <FormControlLabel label="Disabled" control={<FinalFormCheckbox {...props} />} />}
                                            </Field>
                                            <Field name="disabledChecked" type="checkbox" fullWidth disabled>
                                                {(props) => (
                                                    <FormControlLabel label="Disabled & Checked" control={<FinalFormCheckbox {...props} />} />
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
};
