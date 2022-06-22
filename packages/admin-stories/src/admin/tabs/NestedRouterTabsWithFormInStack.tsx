import { Field, FinalForm, FinalFormInput, RouterTab, RouterTabs, Stack } from "@comet/admin";
import { Card, CardContent } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { useLocation } from "react-router";

import { apolloStoryDecorator } from "../../apollo-story.decorator";
import { storyRouterDecorator } from "../../story-router.decorator";

const Story = () => {
    const location = useLocation();

    return (
        <div>
            <p>Location: {location.pathname}</p>
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
                            <RouterTabs>
                                <RouterTab label="Form 1" path="" forceRender>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Field label="Foo" name="foo" component={FinalFormInput} />
                                        </CardContent>
                                    </Card>
                                </RouterTab>
                                <RouterTab label="Form 2" path="/form2" forceRender>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Field label="Bar" name="bar" component={FinalFormInput} />
                                        </CardContent>
                                    </Card>
                                </RouterTab>
                            </RouterTabs>
                        </FinalForm>
                    </RouterTab>
                    <RouterTab label="Lose Form State" path="/lose-form-state" promptOnNavigation>
                        <Card variant="outlined">
                            <CardContent>Form State is lost</CardContent>
                        </Card>
                    </RouterTab>
                </RouterTabs>
            </Stack>
        </div>
    );
};

storiesOf("@comet/admin/tabs", module)
    .addDecorator(storyRouterDecorator())
    .addDecorator(apolloStoryDecorator())
    .add("Nested RouterTabs with Form in Stack", () => <Story />);
