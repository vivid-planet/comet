import { storiesOf } from "@storybook/react";
import { FinalForm, form, Tab, Tabs } from "@vivid-planet/react-admin";
import * as React from "react";

const { Field, FormPaper, Input } = form;

import { apolloStoryDecorator } from "../apollo-story.decorator";

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
                        <Field label="Foo" name="foo" component={Input} />
                    </FormPaper>
                </Tab>
                <Tab label="Example 2">
                    <FormPaper>
                        <Field label="Bar" name="bar" component={Input} />
                    </FormPaper>
                </Tab>
            </Tabs>
        </FinalForm>
    );
}

storiesOf("react-admin", module)
    .addDecorator(apolloStoryDecorator())
    .add("FormTabs", () => <Story />);
