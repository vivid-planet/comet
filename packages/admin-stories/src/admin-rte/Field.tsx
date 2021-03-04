import { Field, FinalFormInput } from "@comet/admin";
import { createFinalFormRte } from "@comet/admin-rte";
import { Button, Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

const { RteField, RteReadOnly } = createFinalFormRte();

function Story() {
    const [submitedValue, setSubmittedValue] = React.useState<{ rteContent: any }>({ rteContent: undefined });
    const [disabled, toggleDisabled] = React.useReducer((s) => !s, false);

    return (
        <div>
            <div style={{ maxWidth: "800px" }}>
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
            </div>
            <Typography variant="h5" color="primary">
                Readonly Component:
            </Typography>
            <RteReadOnly content={submitedValue.rteContent} />
        </div>
    );
}

storiesOf("@comet/admin-rte/field", module).add("Field", () => <Story />);
