import {
    Field,
    FinalForm,
    FinalFormInput,
    RouterTab,
    RouterTabs,
    SaveButton,
    SplitButton,
    Stack,
    Toolbar,
    ToolbarActions,
    ToolbarBackButton,
    ToolbarFillSpace,
} from "@comet/admin";
import { Card, CardContent } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { storyRouterDecorator } from "../../story-router.decorator";

function Story() {
    return (
        <Stack topLevelTitle="Root Stack">
            <RouterTabs>
                <RouterTab label="Top 1" path="">
                    <RouterTabs>
                        <RouterTab label="Form 1" path="" forceRender={true}>
                            <Card variant="outlined">
                                <CardContent>
                                    <FinalForm
                                        mode="edit"
                                        onSubmit={(values: any) => {
                                            alert(JSON.stringify(values));
                                        }}
                                        initialValues={{
                                            foo: "foo",
                                            bar: "bar",
                                        }}
                                    >
                                        {({ pristine, dirty, hasValidationErrors, submitting, hasSubmitErrors, handleSubmit, ...formVars }) => {
                                            return (
                                                <>
                                                    Pristine: {String(pristine)} <br />
                                                    Dirty: {String(dirty)}
                                                    <Toolbar>
                                                        <ToolbarBackButton />
                                                        <ToolbarFillSpace />
                                                        <ToolbarActions>
                                                            <SplitButton
                                                                disabled={pristine || hasValidationErrors || submitting}
                                                                localStorageKey="routertabs-with-forms-save"
                                                            >
                                                                <SaveButton
                                                                    color="primary"
                                                                    variant="contained"
                                                                    saving={submitting}
                                                                    hasErrors={hasSubmitErrors}
                                                                    type="button"
                                                                    onClick={async () => {
                                                                        handleSubmit();
                                                                    }}
                                                                >
                                                                    Save
                                                                </SaveButton>
                                                                <SaveButton
                                                                    color="primary"
                                                                    variant="contained"
                                                                    saving={submitting}
                                                                    hasErrors={hasSubmitErrors}
                                                                    onClick={async () => {
                                                                        handleSubmit();
                                                                    }}
                                                                >
                                                                    Save and go back
                                                                </SaveButton>
                                                            </SplitButton>
                                                        </ToolbarActions>
                                                    </Toolbar>
                                                    <Card variant="outlined">
                                                        <Field label="Foo" name="foo" component={FinalFormInput} />
                                                    </Card>
                                                </>
                                            );
                                        }}
                                    </FinalForm>
                                </CardContent>
                            </Card>
                        </RouterTab>
                        <RouterTab label="Outside Form" path="/outside-form" forceRender={true}>
                            <Card variant="outlined">
                                <CardContent>Outside Form</CardContent>
                            </Card>
                        </RouterTab>
                    </RouterTabs>
                </RouterTab>
                <RouterTab label="Top 2" path="/top2">
                    <Card variant="outlined">
                        <CardContent>Top2</CardContent>
                    </Card>
                </RouterTab>
            </RouterTabs>
        </Stack>
    );
}

storiesOf("@comet/admin/form", module)
    .addDecorator(storyRouterDecorator())
    .add("Form with router tabs", () => <Story />);
