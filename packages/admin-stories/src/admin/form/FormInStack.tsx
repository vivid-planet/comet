import {
    Field,
    FinalForm,
    FinalFormInput,
    FinalFormSaveCancelButtonsLegacy,
    Stack,
    StackPage,
    StackSwitch,
    StackSwitchApiContext,
    Toolbar,
    ToolbarActions,
    ToolbarFillSpace,
} from "@comet/admin";
import { Box, Button, Card, CardContent } from "@mui/material";
import { storiesOf } from "@storybook/react";
import { SubmissionErrors } from "final-form";
import * as React from "react";

import { apolloStoryDecorator } from "../../apollo-story.decorator";
import { storyRouterDecorator } from "../../story-router.decorator";

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
    // TODO: Fix this
    // eslint-disable-next-line no-unsafe-optional-chaining
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
            <Box marginBottom={4}>
                <Toolbar>
                    <ToolbarFillSpace />
                    <ToolbarActions>
                        <Button
                            color={"primary"}
                            variant={"contained"}
                            onClick={() => {
                                switchApi?.activatePage("page2", "test");
                            }}
                        >
                            activate page2
                        </Button>
                    </ToolbarActions>
                </Toolbar>
            </Box>
            <FinalForm mode="edit" onSubmit={onSubmit} initialValues={{}} resolveSubmitErrors={resolveSubmitErrors}>
                <Card variant="outlined">
                    <CardContent>
                        <Box marginBottom={4}>
                            <Field label="Foo" name="foo" component={FinalFormInput} />
                        </Box>
                        <FinalFormSaveCancelButtonsLegacy />
                    </CardContent>
                </Card>
            </FinalForm>
        </>
    );
}

function Page2() {
    return (
        <FinalForm mode="edit" onSubmit={onSubmit} initialValues={{}} resolveSubmitErrors={resolveSubmitErrors}>
            <Card variant="outlined">
                <CardContent>
                    <Box marginBottom={4}>
                        <Field label="Bar" name="bar" component={FinalFormInput} />
                    </Box>
                    <FinalFormSaveCancelButtonsLegacy />
                </CardContent>
            </Card>
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
