import {
    Field,
    FinalForm,
    FinalFormInput,
    RouterTab,
    RouterTabs,
    Stack,
    StackBreadcrumbs,
    StackLink,
    StackPage,
    StackSwitch,
    Toolbar,
    ToolbarBackButton,
} from "@comet/admin";
import { Card, CardContent } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Redirect } from "react-router";

import { apolloStoryDecorator } from "../../apollo-story.decorator";
import { storyRouterDecorator } from "../../story-router.decorator";

function StackPageOne() {
    return (
        <FinalForm
            mode="edit"
            onSubmit={(values: any) => {
                alert(JSON.stringify(values));
            }}
        >
            <RouterTabs>
                <RouterTab label="Form 1" path="" forceRender>
                    <Card variant="outlined">
                        <CardContent>
                            <Field label="Name" name="name" component={FinalFormInput} />
                        </CardContent>
                    </Card>
                </RouterTab>
                <RouterTab label="Form 2" path="/form2" forceRender>
                    <Card variant="outlined">
                        <CardContent>
                            <Field label="Foo" name="foo" component={FinalFormInput} />
                        </CardContent>
                    </Card>
                </RouterTab>
                <RouterTab label="Not Form" path="/not-form">
                    <Card variant="outlined">
                        <CardContent>Here are no form fields</CardContent>
                    </Card>
                </RouterTab>
                <RouterTab label="Prompt on Navigation" path="/prompt" promptOnNavigation>
                    <Card variant="outlined">
                        <CardContent>You received a Discard unsaved changes prompt before navigating here</CardContent>
                    </Card>
                </RouterTab>
            </RouterTabs>
        </FinalForm>
    );
}

function Story() {
    const [redirected, setRedirected] = React.useState(false);

    React.useEffect(() => {
        setRedirected(true);
    }, []);

    return (
        <Stack topLevelTitle="Root Stack">
            <Toolbar>
                <ToolbarBackButton />
            </Toolbar>
            <StackBreadcrumbs />
            <StackSwitch>
                <StackPage name="table">
                    {!redirected && <Redirect to="/test/edit" />}
                    <StackLink pageName="edit" payload="test">
                        Go to Edit
                    </StackLink>
                </StackPage>
                <StackPage name="edit" title="Edit">
                    <StackPageOne />
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}

storiesOf("@comet/admin/tabs", module)
    .addDecorator(storyRouterDecorator())
    .addDecorator(apolloStoryDecorator())
    .add("RouterTabs with Form in Stack", () => <Story />);
