import {
    Field,
    FinalForm,
    FinalFormInput,
    FinalFormSaveCancelButtonsLegacy,
    FormPaper,
    Stack,
    StackPage,
    StackSwitch,
    StackSwitchApiContext,
} from "@comet/admin";
import { Button } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import { SubmissionErrors } from "final-form";
import * as React from "react";
import storyRouterDecorator from "storybook-react-router";

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

function Page1() {
    const switchApi = React.useContext(StackSwitchApiContext);

    return (
        <>
            <Button
                color={"primary"}
                variant={"contained"}
                onClick={() => {
                    switchApi?.activatePage("page2", "test");
                }}
            >
                activate page2
            </Button>
            <FinalForm mode="edit" onSubmit={onSubmit} initialValues={{}} resolveSubmitErrors={resolveSubmitErrors}>
                <div>
                    <FormPaper>
                        <Field label="Foo" name="foo" component={FinalFormInput} />
                    </FormPaper>
                </div>
                <FinalFormSaveCancelButtonsLegacy />
            </FinalForm>
        </>
    );
}

function Page2() {
    return (
        <FinalForm mode="edit" onSubmit={onSubmit} initialValues={{}} resolveSubmitErrors={resolveSubmitErrors}>
            <div>
                <FormPaper>
                    <Field label="Bar" name="bar" component={FinalFormInput} />
                </FormPaper>
            </div>
            <FinalFormSaveCancelButtonsLegacy />
        </FinalForm>
    );
}

function Story() {
    return (
        <Stack topLevelTitle={"Stack"}>
            <StackSwitch>
                <StackPage name="page1">
                    <Page1 />
                </StackPage>
                <StackPage name="page2">
                    <Page2 />
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}

storiesOf("@comet/admin/form", module)
    .addDecorator(apolloStoryDecorator())
    .addDecorator(storyRouterDecorator())
    .add("FormInStack", () => <Story />);
