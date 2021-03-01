import { Field } from "@comet/admin-core";
import { createFinalFormRte } from "@comet/admin-rte";
import { Button, Typography } from "@material-ui/core";
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
        <div>
            <div style={{ maxWidth: "800px" }}>
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
            </div>
            <Typography variant="h5" color="primary">
                Readonly Component:
            </Typography>
            <RteReadOnly content={submitedValue.rteContent} />
        </div>
    );
}

storiesOf("@comet/admin-rte/field", module).add("Field, all options", () => <Story />);
