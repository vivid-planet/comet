import {
    Field,
    FinalForm,
    FinalFormInput,
    SaveButton,
    SplitButton,
    Tab,
    Tabs,
    Toolbar,
    ToolbarActions,
    ToolbarBackButton,
    ToolbarFillSpace,
} from "@comet/admin";
import { Card, CardContent } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { apolloStoryDecorator } from "../../../../apollo-story.decorator";
import { storyRouterDecorator } from "../../../../story-router.decorator";

storiesOf("stories/components/Tabs/Tabs forceRender", module)
    .addDecorator(storyRouterDecorator())
    .addDecorator(apolloStoryDecorator())
    .add("Tabs in Form with forceRender", () => {
        return (
            <div>
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
                                        <SplitButton disabled={pristine || hasValidationErrors || submitting} localStorageKey="tabs-with-forms-save">
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
                                <Tabs>
                                    <Tab label="Tab 1" forceRender>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Field label="Foo" name="foo" component={FinalFormInput} />
                                            </CardContent>
                                        </Card>
                                    </Tab>
                                    <Tab label="Tab 2" forceRender>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Field label="Bar" name="bar" component={FinalFormInput} />
                                            </CardContent>
                                        </Card>
                                    </Tab>
                                </Tabs>
                            </>
                        );
                    }}
                </FinalForm>
            </div>
        );
    })
    .add("Tabs in Form without forceRender", () => {
        // !!!!!!!! Note: This example is how NOT to do it !!!!!!!!
        return (
            <div>
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
                                        <SplitButton disabled={pristine || hasValidationErrors || submitting} localStorageKey="tabs-with-forms-save">
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
                                <Tabs>
                                    <Tab label="Tab 1">
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Field label="Foo" name="foo" component={FinalFormInput} />
                                            </CardContent>
                                        </Card>
                                    </Tab>
                                    <Tab label="Tab 2">
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Field label="Bar" name="bar" component={FinalFormInput} />
                                            </CardContent>
                                        </Card>
                                    </Tab>
                                </Tabs>
                            </>
                        );
                    }}
                </FinalForm>
            </div>
        );
    })
    .add("Form in Tabs with forceRender", () => {
        return (
            <div>
                <Tabs>
                    <Tab label="Form" forceRender>
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
                    </Tab>
                    <Tab label="Tab 2">
                        <Card variant="outlined">
                            <CardContent>Tab 2</CardContent>
                        </Card>
                    </Tab>
                </Tabs>
            </div>
        );
    })
    .add("Form in Tabs without forceRender", () => {
        // !!!!!!!! Note: This example is how NOT to do it !!!!!!!!
        return (
            <div>
                <Tabs>
                    <Tab label="Form">
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
                    </Tab>
                    <Tab label="Tab 2">
                        <Card variant="outlined">
                            <CardContent>Tab 2</CardContent>
                        </Card>
                    </Tab>
                </Tabs>
            </div>
        );
    });
