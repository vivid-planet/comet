import { Field, FinalForm, FinalFormContext, FinalFormInput } from "@comet/admin";
import { Button, Typography } from "@mui/material";
import * as React from "react";

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

type ShowStrategy = "always" | "while-typing" | "on-blur" | "when-submitted";
const strategies: Record<ShowStrategy, FinalFormContext["shouldShowFieldError"]> = {
    always: () => true,
    "on-blur": ({ touched }) => !!touched,
    "while-typing": ({ touched, active }) => !!(touched || active),
    "when-submitted": ({ submitFailed }) => !!submitFailed,
};

export default {
    title: "@comet/admin/form",
    args: {
        strategy: "when-submitted",
    },
    argTypes: {
        strategy: {
            name: "Show Error Strategy",
            control: "select",
            options: ["always", "on-blur", "while-typing", "when-submitted"],
        },
    },
};

type Args = {
    strategy: ShowStrategy;
};

export const ShowErrorStrategies = {
    render: ({ strategy }: Args) => {
        const initialValues = {
            foo: "foo",
            bar: "",
        };

        const shouldShowFieldError = strategies[strategy];
        return (
            <FinalForm<FormValues>
                mode="edit"
                onSubmit={() => {
                    // noop
                }}
                initialValues={initialValues}
                validate={validate}
                formContext={{ shouldShowFieldError }}
            >
                {({ form }) => (
                    <>
                        <Typography variant="body1">
                            Demonstrates different implementations of &quot;shouldShowFieldError&quot;. Use Knob to switch strategies.
                        </Typography>

                        <Typography variant="h3">Show-Error-Strategy: &quot;{strategy}&quot;</Typography>
                        <Field label="Foo" name="foo" component={FinalFormInput} fullWidth />
                        <Field label="Bar" name="bar" component={FinalFormInput} fullWidth />
                        <Button variant="contained" color="primary" type="submit">
                            Submit
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                form.reset();
                                form.resetFieldState("foo");
                                form.resetFieldState("bar");
                            }}
                        >
                            Reset form and field state
                        </Button>
                    </>
                )}
            </FinalForm>
        );
    },
};
