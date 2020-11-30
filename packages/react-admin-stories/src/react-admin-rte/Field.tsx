import { Button, Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import { Field } from "@vivid-planet/react-admin";
import { createFinalFormRte } from "@vivid-planet/react-admin-rte";
import * as React from "react";
import { Form } from "react-final-form";

const { RteField, RteReadOnly } = createFinalFormRte();

function Story() {
    const [submitedValue, setSubmittedValue] = React.useState<{ rteContent: any }>({ rteContent: undefined });

    return (
        <div>
            <div style={{ maxWidth: "800px" }}>
                <Form
                    onSubmit={(values: { rteContent: any }) => {
                        //
                        setSubmittedValue({ rteContent: values });
                    }}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <Field name="rteContent" label="Rich Text" component={RteField} />
                            <Button color="primary" variant="contained" type="submit" component={"button"} disableTouchRipple>
                                <Typography variant="button">Submit</Typography>
                            </Button>
                        </form>
                    )}
                />
            </div>
            <Typography variant="h5" color="primary">
                Readonly Component:
            </Typography>
            <RteReadOnly content={submitedValue.rteContent} />
        </div>
    );
}

storiesOf("react-admin-rte/field", module).add("Field", () => <Story />);
