import {
    Field,
    FinalForm,
    FinalFormInput,
    RouterTab,
    RouterTabs,
    SaveButton,
    SplitButton,
    Toolbar,
    ToolbarActions,
    ToolbarBackButton,
    ToolbarFillSpace,
} from "@comet/admin";
import { Card, CardContent } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { useLocation } from "react-router";

import { apolloStoryDecorator } from "../../../../apollo-story.decorator";
import { storyRouterDecorator } from "../../../../story-router.decorator";

storiesOf("stories/components/Tabs/RouterTabs forceRender", module)
    .addDecorator(storyRouterDecorator())
    .addDecorator(apolloStoryDecorator())
    .add("RouterTabs in Form with forceRender", () => {
        const location = useLocation();

        return (
            <div>
                <p>Location: {location.pathname}</p>
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
                                    <RouterTab label="Tab 1" path="" forceRender>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Field label="Foo" name="foo" component={FinalFormInput} />
                                            </CardContent>
                                        </Card>
                                    </RouterTab>
                                    <RouterTab label="Tab 2" path="/tab2" forceRender>
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
            </div>
        );
    })
    .add("RouterTabs in Form without forceRender", () => {
        // !!!!!!!! Note: This example is how NOT to do it !!!!!!!!
        const location = useLocation();

        return (
            <div>
                <p>Location: {location.pathname}</p>
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
                                    <RouterTab label="Tab 1" path="">
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Field label="Foo" name="foo" component={FinalFormInput} />
                                            </CardContent>
                                        </Card>
                                    </RouterTab>
                                    <RouterTab label="Tab 2" path="/tab2">
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
            </div>
        );
    })
    .add("Form in RouterTabs with forceRender", () => {
        const location = useLocation();

        return (
            <div>
                <p>Location: {location.pathname}</p>
                <RouterTabs>
                    <RouterTab label="Form" path="" forceRender>
                        <Card variant="outlined">
                            <CardContent>
                                <FinalForm
                                    mode="add"
                                    onSubmit={(values: any) => {
                                        alert(JSON.stringify(values));
                                    }}
                                >
                                    <Field label="Name" name="name" component={FinalFormInput} />
                                </FinalForm>
                            </CardContent>
                        </Card>
                    </RouterTab>
                    <RouterTab label="Tab 2" path="/tab2">
                        <Card variant="outlined">
                            <CardContent>Tab 2</CardContent>
                        </Card>
                    </RouterTab>
                </RouterTabs>
            </div>
        );
    })
    .add("Form in RouterTabs without forceRender", () => {
        // !!!!!!!! Note: This example is how NOT to do it !!!!!!!!
        const location = useLocation();

        return (
            <div>
                <p>Location: {location.pathname}</p>
                <RouterTabs>
                    <RouterTab label="Form" path="">
                        <Card variant="outlined">
                            <CardContent>
                                <FinalForm
                                    mode="add"
                                    onSubmit={(values: any) => {
                                        alert(JSON.stringify(values));
                                    }}
                                >
                                    <Field label="Name" name="name" component={FinalFormInput} />
                                </FinalForm>
                            </CardContent>
                        </Card>
                    </RouterTab>
                    <RouterTab label="Tab 2" path="/tab2">
                        <Card variant="outlined">
                            <CardContent>Tab 2</CardContent>
                        </Card>
                    </RouterTab>
                </RouterTabs>
            </div>
        );
    });
