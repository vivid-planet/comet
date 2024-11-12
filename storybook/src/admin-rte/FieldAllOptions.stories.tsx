import { Field, FormSection } from "@comet/admin";
import { createFinalFormRte } from "@comet/admin-rte";
import { Button, Card, CardContent, Grid } from "@mui/material";
import * as React from "react";
import { Form } from "react-final-form";

import { ContentFormat, defaultContent, makeApiOptions, rteOptions } from "./RteAllOptions.stories";

const { RteField, RteReadOnly } = createFinalFormRte<ContentFormat>({
    rteApiOptions: makeApiOptions, // see ./RteAllOptions for details
    rteOptions, // see ./RteAllOptions for details
});

export default {
    title: "@comet/admin-rte/field",
};

export const FieldAllOptions = {
    render: () => {
        const [submittedValue, setSubmittedValue] = React.useState<{ rteContent: any }>({ rteContent: defaultContent });

        return (
            <Grid container spacing={4} style={{ maxWidth: 800 }}>
                <Grid item xs={12}>
                    <Card variant="outlined">
                        <CardContent>
                            <Form
                                initialValues={{
                                    rteContent: defaultContent,
                                }}
                                onSubmit={(values) => {
                                    setSubmittedValue({ rteContent: values.rteContent });
                                }}
                                render={({ handleSubmit }) => (
                                    <form onSubmit={handleSubmit}>
                                        <Field name="rteContent" label="Rich Text" component={RteField} fullWidth />
                                        <Button color="primary" variant="contained" type="submit" component="button" disableTouchRipple>
                                            Submit
                                        </Button>
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
    },

    name: "Field, all options",
};
