import { Field, FinalFormInput, FormSection } from "@comet/admin";
import { createFinalFormRte } from "@comet/admin-rte";
import { Button, Card, CardContent, Grid } from "@mui/material";
import { useReducer, useState } from "react";
import { Form } from "react-final-form";

const { RteField, RteReadOnly } = createFinalFormRte();

export default {
    title: "@comet/admin-rte/field",
};

export const _Field = () => {
    const [submittedValue, setSubmittedValue] = useState<{ rteContent: any }>({ rteContent: undefined });
    const [disabled, toggleDisabled] = useReducer((s) => !s, false);

    return (
        <Grid container spacing={4} style={{ maxWidth: 800 }}>
            <Grid item xs={12}>
                <Card variant="outlined">
                    <CardContent>
                        <Form
                            onSubmit={(values: { rteContent: any }) => {
                                setSubmittedValue({ rteContent: values.rteContent });
                            }}
                            render={({ handleSubmit }) => (
                                <form onSubmit={handleSubmit}>
                                    <Field name="rteContent" label="Rich Text" component={RteField} disabled={disabled} />
                                    <Field name="somethingElse" label="Something else" component={FinalFormInput} disabled={disabled} />
                                    <Grid container spacing={4}>
                                        <Grid item>
                                            <Button
                                                color="secondary"
                                                variant="contained"
                                                type="button"
                                                component="button"
                                                disableTouchRipple
                                                onClick={toggleDisabled}
                                            >
                                                {disabled ? "Enable" : "Disable"} inputs
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button color="primary" variant="contained" type="submit" component="button" disableTouchRipple>
                                                Submit
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            )}
                        />
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Card variant="outlined">
                    <CardContent>
                        <FormSection title="Readonly Component" disableMarginBottom>
                            <RteReadOnly content={submittedValue.rteContent} />
                        </FormSection>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};
