import { Field, FormPaper } from "@comet/admin";
import { createFinalFormRte } from "@comet/admin-rte";
import { Box, Button, Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

import { ContentFormat, defaultContent, makeApiOptions, rteOptions } from "./RteAllOptions";

const { RteField, RteReadOnly } = createFinalFormRte<ContentFormat>({
    rteApiOptions: makeApiOptions, // see ./RteAllOptions for details
    rteOptions, // see ./RteAllOptions for details
});

function Story() {
    const [submitedValue, setSubmittedValue] = React.useState<{ rteContent: any }>({ rteContent: defaultContent });

    return (
        <div style={{ maxWidth: 800 }}>
            <Box marginBottom={4}>
                <FormPaper variant="outlined">
                    <Form
                        initialValues={{
                            rteContent: defaultContent,
                        }}
                        onSubmit={(values) => {
                            //
                            setSubmittedValue({ rteContent: values.rteContent });
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
                </FormPaper>
            </Box>
            <FormPaper variant="outlined">
                <Typography variant="h5" color="primary">
                    Readonly Component:
                </Typography>
                <RteReadOnly content={submitedValue.rteContent} />
            </FormPaper>
        </div>
    );
}

storiesOf("@comet/admin-rte/field", module).add("Field, all options", () => <Story />);
