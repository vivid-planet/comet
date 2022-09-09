import { Field, FinalForm, FinalFormInput, FormSection, SaveButton } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { apolloStoryDecorator } from "../../apollo-story.decorator";

storiesOf("stories/form/FinalForm", module)
    .addDecorator(apolloStoryDecorator())
    .add("Disabled Submit If Not Dirty", () => {
        return (
            <FinalForm
                mode="add"
                onSubmit={async (values) => {
                    window.alert(JSON.stringify(values));
                }}
            >
                {({ dirty }) => (
                    <>
                        <FormSection>
                            <Field label="First name" name="firstname" component={FinalFormInput} fullWidth />
                            <Field label="Last name" name="lastname" component={FinalFormInput} fullWidth />
                        </FormSection>
                        <SaveButton type="submit" disabled={!dirty} />
                    </>
                )}
            </FinalForm>
        );
    });
