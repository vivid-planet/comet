import { Field, FinalFormInput, FormPaper } from "@comet/admin";
import { createFinalFormRte } from "@comet/admin-rte";
import { Box, Button, Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

const { RteField, RteReadOnly } = createFinalFormRte();

function Story() {
    const [submitedValue, setSubmittedValue] = React.useState<{ rteContent: any }>({ rteContent: undefined });
    const [disabled, toggleDisabled] = React.useReducer((s) => !s, false);

    return (
        <div style={{ maxWidth: 800 }}>
            <Box marginBottom={4}>
                <FormPaper variant="outlined">
                    <Form
                        onSubmit={(values: { rteContent: any }) => {
                            //
                            setSubmittedValue({ rteContent: values.rteContent });
                        }}
                        render={({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <Field name="rteContent" label="Rich Text" component={RteField} disabled={disabled} />
                                <Field name="somenthingElse" label="Something else" component={FinalFormInput} disabled={disabled} />
                                <Button
                                    color="secondary"
                                    variant="contained"
                                    type="button"
                                    component={"button"}
                                    disableTouchRipple
                                    onClick={toggleDisabled}
                                >
                                    <Typography variant="button">{disabled ? "Enable" : "Disable"} inputs</Typography>
                                </Button>
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

storiesOf("@comet/admin-rte/field", module).add("Field", () => <Story />);
