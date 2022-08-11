import { Field, FinalForm, FinalFormInput } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { apolloStoryDecorator } from "../../../../apollo-story.decorator";

storiesOf("stories/Form/Components", module)
    .addDecorator(apolloStoryDecorator())
    .add("Field", () => {
        return (
            <FinalForm mode="add" onSubmit={() => {}}>
                <Field type="text" name="normal" label="Normal" component={FinalFormInput} />
                <Field type="text" name="required" label="Required" component={FinalFormInput} required />
                <Field type="text" name="disabled" label="Disabled" component={FinalFormInput} disabled />
            </FinalForm>
        );
    });
