import { Field, FinalForm, FinalFormInput } from "@comet/admin";
import { Button, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { apolloStoryDecorator } from "../../apollo-story.decorator";

interface FormValues {
    foo: string;
    bar: string;
}

function validate({ foo, bar }: FormValues) {
    const errors: Partial<Record<keyof FormValues, string>> = {};
    if (foo !== "foo") {
        errors.foo = `${foo} is not foo`;
    }
    if (bar !== "bar") {
        errors.bar = `${bar} is not bar`;
    }
    return errors;
}

function Story() {
    const initialValues = {
        foo: "foo",
        bar: "",
    };

    const [open, setOpen] = React.useState(false);
    return (
        <>
            <Button variant="contained" color="primary" onClick={() => setOpen((s) => !s)}>
                Click to Render Form
            </Button>
            <Typography>The page then scrolls to the 2nd field which has an error.</Typography>
            {open && (
                <>
                    <FinalForm<FormValues>
                        mode="edit"
                        onSubmit={() => {
                            // noop
                        }}
                        initialValues={initialValues}
                        validate={validate}
                        formContext={{ shouldScrollToField: ({ fieldMeta: { touched } }) => !touched, shouldShowFieldError: () => true }}
                    >
                        <Field label="Foo" name="foo" component={FinalFormInput} fullWidth />
                        <div style={{ height: "2000px", borderLeft: "1px solid black" }}></div>
                        <Field label="Bar" name="bar" component={FinalFormInput} fullWidth />
                    </FinalForm>
                </>
            )}
        </>
    );
}

storiesOf("@comet/admin/form", module)
    .addDecorator(apolloStoryDecorator())
    .add("Scroll To Error Field", () => <Story />);
