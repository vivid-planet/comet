import { Field, FinalForm, FinalFormInput, FormSection, LegacySaveButton } from "@comet/admin";

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
                    <LegacySaveButton type="submit" disabled={!dirty} />
                </>
            )}
        </FinalForm>
    );
};
