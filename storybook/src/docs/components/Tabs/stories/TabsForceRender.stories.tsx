import {
    Field,
    FinalForm,
    FinalFormInput,
    FinalFormSaveButton,
    Tab,
    Tabs,
    Toolbar,
    ToolbarActions,
    ToolbarBackButton,
    ToolbarFillSpace,
} from "@comet/admin";
import { Card, CardContent } from "@mui/material";
import * as React from "react";

import { apolloRestStoryDecorator } from "../../../../apollo-rest-story.decorator";
import { storyRouterDecorator } from "../../../../story-router.decorator";

export default {
    title: "stories/components/Tabs/Tabs forceRender",
    decorators: [storyRouterDecorator(), apolloRestStoryDecorator()],
};

export const TabsInFormWithForceRender = () => {
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
                                    <FinalFormSaveButton />
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
};

TabsInFormWithForceRender.storyName = "Tabs in Form with forceRender";

export const TabsInFormWithoutForceRender = () => {
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
                                    <FinalFormSaveButton />
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
};

TabsInFormWithoutForceRender.storyName = "Tabs in Form without forceRender";

export const FormInTabsWithForceRender = () => {
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
};

FormInTabsWithForceRender.storyName = "Form in Tabs with forceRender";

export const FormInTabsWithoutForceRender = () => {
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
};

FormInTabsWithoutForceRender.storyName = "Form in Tabs without forceRender";
