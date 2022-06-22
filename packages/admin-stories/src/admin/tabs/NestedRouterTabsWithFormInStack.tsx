import { Field, FinalForm, FinalFormInput, RouterTab, RouterTabs, Stack, StackBreadcrumbs, StackPage, StackSwitch } from "@comet/admin";
import { Card, CardContent } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { useLocation } from "react-router";

import { apolloStoryDecorator } from "../../apollo-story.decorator";
import { storyRouterDecorator } from "../../story-router.decorator";

function Story() {
    const location = useLocation();

    return (
        <div>
            <p>Location: {location.pathname}</p>
            <Stack topLevelTitle="Root Stack">
                <StackBreadcrumbs />
                <FinalForm
                    mode="edit"
                    onSubmit={(values: any) => {
                        alert(JSON.stringify(values));
                    }}
                >
                    <RouterTabs>
                        <RouterTab label="Page 1" path="" forceRender>
                            <Card variant="outlined">
                                <CardContent>
                                    <Field label="Firstname" name="firstname" component={FinalFormInput} />
                                </CardContent>
                            </Card>
                            <StackSwitch>
                                <StackPage name="table">
                                    <RouterTabs>
                                        <RouterTab label="Page 3" path="" forceRender>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Field label="Lastname" name="lastname" component={FinalFormInput} />
                                                </CardContent>
                                            </Card>
                                        </RouterTab>
                                        <RouterTab label="Page 4" path="/page4" forceRender>
                                            Now the first level of RouterTabs (Page 1 and 2) disappeared
                                            <StackSwitch>
                                                <StackPage name="table">
                                                    <RouterTabs>
                                                        <RouterTab label="Page 5" path="" forceRender>
                                                            <Card variant="outlined">
                                                                <CardContent>
                                                                    <Field label="Address" name="address" component={FinalFormInput} />
                                                                </CardContent>
                                                            </Card>
                                                        </RouterTab>
                                                        <RouterTab label="Page 6" path="/page6" forceRender>
                                                            Now the second level of RouterTabs (Page 3 and 4) also disappeared
                                                            <StackSwitch>
                                                                <StackPage name="table">
                                                                    <RouterTabs>
                                                                        <RouterTab label="Page 7" path="" forceRender>
                                                                            <Card variant="outlined">
                                                                                <CardContent>
                                                                                    <Field
                                                                                        label="Country"
                                                                                        name="country"
                                                                                        component={FinalFormInput}
                                                                                    />
                                                                                </CardContent>
                                                                            </Card>
                                                                        </RouterTab>
                                                                        <RouterTab label="Prompt on Navigation" path="/prompt2" promptOnNavigation>
                                                                            <Card variant="outlined">
                                                                                <CardContent>
                                                                                    You received a Discard unsaved changes prompt before navigating
                                                                                    here
                                                                                </CardContent>
                                                                            </Card>
                                                                        </RouterTab>
                                                                    </RouterTabs>
                                                                </StackPage>
                                                                <StackPage name="stackpage-4">StackPage 4</StackPage>
                                                            </StackSwitch>
                                                        </RouterTab>
                                                    </RouterTabs>
                                                </StackPage>
                                                <StackPage name="stackpage-3">StackPage 3</StackPage>
                                            </StackSwitch>
                                        </RouterTab>
                                    </RouterTabs>
                                </StackPage>
                                <StackPage name="stackpage-2">StackPage 2</StackPage>
                            </StackSwitch>
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
            </Stack>
        </div>
    );
}

storiesOf("@comet/admin/tabs", module)
    .addDecorator(storyRouterDecorator())
    .addDecorator(apolloStoryDecorator())
    .add("Nested RouterTabs with Form in Stack", () => <Story />);
