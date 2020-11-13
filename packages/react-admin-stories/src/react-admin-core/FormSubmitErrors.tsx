import { storiesOf } from "@storybook/react";
import { FinalForm } from "@vivid-planet/react-admin-core";
import { Field, FormPaper, Input } from "@vivid-planet/react-admin-form";
import { SubmissionErrors } from "final-form";
import * as React from "react";

import { apolloStoryDecorator } from "../apollo-story.decorator";

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
    for (const submitError of error.errors) {
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
                    <Field label="Foo" name="foo" component={Input} />
                </FormPaper>
                <FormPaper>
                    <Field label="Bar" name="bar" component={Input} />
                </FormPaper>
            </div>
        </FinalForm>
    );
}

storiesOf("react-admin-core", module)
    .addDecorator(apolloStoryDecorator())
    .add("FormSubmitErrors", () => <Story />);
