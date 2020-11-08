import { Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import { FinalForm, Tab, Tabs } from "@vivid-planet/react-admin-core";
import { Radio } from "@vivid-planet/react-admin-final-form-material-ui";
import { DatePicker, Field, FieldContainer, FormPaper, Input } from "@vivid-planet/react-admin-form";
import { styled } from "@vivid-planet/react-admin-mui";
import * as React from "react";
import { Field as FinalFormField } from "react-final-form";
import { apolloStoryDecorator } from "../apollo-story.decorator";

function Story() {
    return (
        <FinalForm
            mode="edit"
            onSubmit={values => {
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

storiesOf("react-admin-core", module)
    .addDecorator(apolloStoryDecorator())
    .add("FormTabs", () => <Story />);
