import { Field } from "@comet/admin";
import { createFinalFormRte } from "@comet/admin-rte";
import { Button, Card, CardContent } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

const { RteField } = createFinalFormRte();

function Story() {
    return (
        <Card variant="outlined">
            <CardContent>
                <Form
                    onSubmit={() => {
                        // nothing
                    }}
                    render={({ handleSubmit, values }) => (
                        <form onSubmit={handleSubmit}>
                            <pre>{JSON.stringify({ values }, null, 2)}</pre>
                            <Field name="rteContent" label="Rich Text" component={RteField} fullWidth />
                            <Field name="rteContent" label="Rich Text" component={RteField} fullWidth />
                            <Button color="primary" variant="contained" type="submit" component="button" disableTouchRipple>
                                Submit
                            </Button>
                        </form>
                    )}
                />
            </CardContent>
        </Card>
    );
}

storiesOf("@comet/admin-rte/field", module).add("MultipleFieldsWithSameName", () => <Story />);
