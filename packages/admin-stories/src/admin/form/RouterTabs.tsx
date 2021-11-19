import { Field, FinalForm, FinalFormInput, RouterTab, RouterTabs, Stack } from "@comet/admin";
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
