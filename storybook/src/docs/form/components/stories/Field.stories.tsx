import { Field, FinalForm, FinalFormInput } from "@comet/admin";
import * as React from "react";

import { apolloRestStoryDecorator } from "../../../../apollo-rest-story.decorator";

export default {
    title: "stories/Form/Components",
    decorators: [apolloRestStoryDecorator()],
};

export const _Field = () => {
    return (
        <FinalForm mode="add" onSubmit={() => {}}>
            <Field type="text" name="normal" label="Normal" component={FinalFormInput} />
            <Field type="text" name="required" label="Required" component={FinalFormInput} required />
            <Field type="text" name="disabled" label="Disabled" component={FinalFormInput} disabled />
        </FinalForm>
    );
};
