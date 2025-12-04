import {
    Button,
    Field,
    FillSpace,
    FinalForm,
    FinalFormInput,
    FinalFormSaveCancelButtonsLegacy,
    Stack,
    StackPage,
    StackSwitch,
    StackSwitchApiContext,
    Toolbar,
    ToolbarActions,
} from "@comet/admin";
import { Box, Card, CardContent } from "@mui/material";
import { type SubmissionErrors } from "final-form";
import { useContext } from "react";

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

    if (error) {
        for (const submitError of error.errors) {
            Object.assign(result, submitError);
        }
    }

    // result = {fieldName: errorMessage, ...}
    return result;
};

function Page1() {
    const switchApi = useContext(StackSwitchApiContext);

    return (
        <>
            <Box marginBottom={4}>
                <Toolbar>
                    <FillSpace />
                    <ToolbarActions>
                        <Button
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

export default {
    title: "@comet/admin/form",
    decorators: [storyRouterDecorator()],
};

export const FormInStack = {
    render: () => {
        return (
            <Stack topLevelTitle="Stack">
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
    },

    name: "FormInStack",
};
