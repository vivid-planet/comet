import { Field, FinalForm, FinalFormInput, FormSection, SaveButton } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { apolloStoryDecorator } from "../../../apollo-story.decorator";

storiesOf("stories/form/FinalForm", module)
    .addDecorator(apolloStoryDecorator())
    .add("Basic FinalForm", () => {
        return (
            <FinalForm
                mode="add"
                onSubmit={(values) => {
                    window.alert(JSON.stringify(values));
                }}
            >
                <FormSection>
                    <Field label="First name" name="firstname" placeholder="John" component={FinalFormInput} fullWidth />
                    <Field label="Last name" name="lastname" placeholder="Doe" component={FinalFormInput} fullWidth />
                </FormSection>
                <SaveButton type="submit" />
            </FinalForm>
        );
    });
