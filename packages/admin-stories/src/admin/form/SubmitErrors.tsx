import { Field, FinalForm, FinalFormInput, FormPaper } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import { SubmissionErrors } from "final-form";
import * as React from "react";

import { apolloStoryDecorator } from "../../apollo-story.decorator";

const onSubmit = ({ foo, bar }: { foo: string; bar: string }) => {
    const errors = [];
    if (foo !== "foo") {
        errors.push({ foo: `${foo} is not foo` });
    }
    if (bar !== "bar") {
        errors.push({ bar: `${bar} is not bar` });
    }
    return Promise.reject({ errors });
};

const resolveSubmitErrors = (error: SubmissionErrors) => {
    // error = { errors: [{fieldName: errorMessage},...] }

    const result = {};
    for (const submitError of error?.errors) {
        Object.assign(result, submitError);
    }
    // result = {fieldName: errorMessage, ...}
    return result;
};

function Story() {
    const initialValues = {
        foo: "foo",
    };

    return (
        <FinalForm mode="edit" onSubmit={onSubmit} initialValues={initialValues} resolveSubmitErrors={resolveSubmitErrors}>
            <div>
                <FormPaper>
                    <Field label="Foo" name="foo" component={FinalFormInput} />
                </FormPaper>
                <FormPaper>
                    <Field label="Bar" name="bar" component={FinalFormInput} />
                </FormPaper>
            </div>
        </FinalForm>
    );
}

storiesOf("@comet/admin/form", module)
    .addDecorator(apolloStoryDecorator())
    .add("SubmitErrors", () => <Story />);
