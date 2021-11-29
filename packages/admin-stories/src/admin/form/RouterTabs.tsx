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
import { Card, CardContent } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { storyRouterDecorator } from "../../story-router.decorator";

function Story() {
    return (
        <Stack topLevelTitle="Root Stack">
            <RouterTabs>
                <RouterTab label="Top 1" path="">
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
                        {({ pristine, hasValidationErrors, submitting, hasSubmitErrors, handleSubmit, ...formVars }) => {
                            console.log({ pristine, hasValidationErrors, submitting, hasSubmitErrors, ...formVars });

                            return (
                                <>
                                    <Toolbar>
                                        <ToolbarBackButton />
                                        <ToolbarFillSpace />
                                        <ToolbarActions>
                                            <SplitButton
                                                disabled={pristine || hasValidationErrors || submitting}
                                                localStorageKey={"routertabs-with-forms-save"}
                                            >
                                                <SaveButton
                                                    color={"primary"}
                                                    variant={"contained"}
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
                                                    color={"primary"}
                                                    variant={"contained"}
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
                                    <RouterTabs>
                                        <RouterTab label="Form 1" path="">
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Field label="Foo" name="foo" component={FinalFormInput} />
                                                </CardContent>
                                            </Card>
                                        </RouterTab>
                                        <RouterTab label="Form 2" path="/form2">
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Field label="Bar" name="bar" component={FinalFormInput} />
                                                </CardContent>
                                            </Card>
                                        </RouterTab>
                                    </RouterTabs>
                                </>
                            );
                        }}
                    </FinalForm>
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
    .add("RouterTabs with forms", () => <Story />);
