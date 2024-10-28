import { Field, FinalForm, FinalFormInput, FormSection } from "@comet/admin";
import * as React from "react";

import { apolloRestStoryDecorator } from "../../../../apollo-rest-story.decorator";

export default {
    title: "stories/Form/Components",
    decorators: [apolloRestStoryDecorator()],
};

export const _FormSection = () => {
    return (
        <FinalForm mode="add" onSubmit={() => {}}>
            <FormSection title="Personal information">
                <Field type="text" name="name" label="Name" placeholder="Full name" component={FinalFormInput} fullWidth />
                <Field type="email" name="email" label="Email" placeholder="you@example.com" component={FinalFormInput} fullWidth />
            </FormSection>
            <FormSection title="Message">
                <Field type="text" name="subject" label="Subject" placeholder="Message topic" component={FinalFormInput} fullWidth />
                <Field
                    type="text"
                    name="message"
                    label="Message"
                    placeholder="Your message"
                    component={FinalFormInput}
                    fullWidth
                    multiline
                    rows={4}
                />
            </FormSection>
        </FinalForm>
    );
};

_FormSection.storyName = "FormSection";
