import { Field, FinalFormSwitch } from "@comet/admin";
import { Box, Divider, FormControlLabel, Paper } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

function Story() {
    return (
        <div style={{ width: 500 }}>
            <Form
                onSubmit={(values) => {
                    //
                }}
                render={({ handleSubmit, values }) => (
                    <>
                        <form onSubmit={handleSubmit}>
                            <Paper>
                                <Box padding={4}>
                                    <Field name="foo" label="Switch with yes, no">
                                        {(props) => <FormControlLabel label={values.foo ? "Yes" : "No"} control={<FinalFormSwitch {...props} />} />}
                                    </Field>
                                </Box>
                                <Divider />
                                <Box padding={4}>
                                    <Field name="bar">
                                        {(props) => (
                                            <FormControlLabel label={"Switch with label on the right"} control={<FinalFormSwitch {...props} />} />
                                        )}
                                    </Field>
                                </Box>
                            </Paper>
                        </form>
                    </>
                )}
            />
        </div>
    );
}

storiesOf("@comet/admin/form", module).add("Switch", () => <Story />);
