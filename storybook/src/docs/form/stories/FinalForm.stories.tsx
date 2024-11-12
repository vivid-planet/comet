import { Field, FinalForm, FinalFormInput, FormSection, SaveButton } from "@comet/admin";
import { useFormApiRef } from "@comet/admin/lib/FinalForm";
import * as React from "react";

import { apolloRestStoryDecorator } from "../../../apollo-rest-story.decorator";

export default {
    title: "stories/form/FinalForm",
    decorators: [apolloRestStoryDecorator()],
};

export const BasicFinalForm = {
    render: () => {
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
    },

    name: "Basic FinalForm",
};

export const FinalFormApiRef = {
    render: () => {
        const apiRef = useFormApiRef();
        return (
            <div>
                <FinalForm
                    apiRef={apiRef}
                    mode="add"
                    onSubmit={(values) => {
                        window.alert(JSON.stringify(values));
                    }}
                >
                    <FormSection>
                        <Field label="First name" name="firstname" placeholder="John" component={FinalFormInput} fullWidth />
                        <Field label="Last name" name="lastname" placeholder="Doe" component={FinalFormInput} fullWidth />
                    </FormSection>
                </FinalForm>
                <button
                    onClick={() => {
                        //Using apiRef can access FormApi outside of <FinalForm>
                        apiRef.current?.submit();
                    }}
                >
                    submit
                </button>
            </div>
        );
    },

    name: "FinalForm ApiRef",
};
