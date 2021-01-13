import { Field, FinalForm, FinalFormInput, FormPaper, Tab, Tabs } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { apolloStoryDecorator } from "../../apollo-story.decorator";

function Story() {
    return (
        <FinalForm
            mode="edit"
            onSubmit={(values) => {
                alert(JSON.stringify(values));
            }}
            initialValues={{
                foo: "foo",
                bar: "bar",
            }}
        >
            <Tabs>
                <Tab label="Example 1">
                    <FormPaper>
                        <Field label="Foo" name="foo" component={FinalFormInput} />
                    </FormPaper>
                </Tab>
                <Tab label="Example 2">
                    <FormPaper>
                        <Field label="Bar" name="bar" component={FinalFormInput} />
                    </FormPaper>
                </Tab>
            </Tabs>
        </FinalForm>
    );
}

storiesOf("@comet/admin/form", module)
    .addDecorator(apolloStoryDecorator())
    .add("Tabs", () => <Story />);
