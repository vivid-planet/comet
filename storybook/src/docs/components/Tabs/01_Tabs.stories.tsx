import {
    Field,
    FillSpace,
    FinalForm,
    FinalFormInput,
    FinalFormSaveButton,
    Tab,
    Tabs,
    Toolbar,
    ToolbarActions,
    ToolbarBackButton,
} from "@comet/admin";
import { Card, CardContent } from "@mui/material";

import { storyRouterDecorator } from "../../../story-router.decorator";

export default {
    title: "Docs/Components/Tabs/Tabs",
    decorators: [storyRouterDecorator()],
};

export const Basic = () => {
    return (
        <Tabs>
            <Tab label="Label One">Content One</Tab>
            <Tab label="Label Two">Content Two</Tab>
            <Tab label="Label Three">Content Three</Tab>
        </Tabs>
    );
};

export const TabsInFormWithForceRender = {
    render: () => {
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
                                    <FillSpace />
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
    },

    name: "Tabs in Form with forceRender",
};

export const TabsInFormWithoutForceRender = {
    render: () => {
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
                                    <FillSpace />
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
    },

    name: "Tabs in Form without forceRender",
};

export const FormInTabsWithForceRender = {
    render: () => {
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
    },

    name: "Form in Tabs with forceRender",
};

export const FormInTabsWithoutForceRender = {
    render: () => {
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
    },

    name: "Form in Tabs without forceRender",
};
