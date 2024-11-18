import { Field, FinalForm, FinalFormInput, FormSection, SaveButton } from "@comet/admin";
import * as React from "react";

export default {
    title: "stories/form/FinalForm",
};

export const DisabledSubmitIfNotDirty = () => {
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
};
