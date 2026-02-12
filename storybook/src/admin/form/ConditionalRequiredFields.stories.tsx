import { CheckboxField, FinalForm, TextField } from "@comet/admin";
import React from "react";

export default {
    title: "@comet/admin/form",
};

export const ConditionalRequiredFields = () => {
    type FormValues = {
        description?: string;
        descriptionRequired?: boolean;
    };

    return (
        <FinalForm<FormValues> mode="edit" onSubmit={() => {}}>
            {({ values }) => (
                <>
                    <TextField name="description" label="Description" fullWidth required={values.descriptionRequired} />
                    <CheckboxField name="descriptionRequired" label="Description required" />
                </>
            )}
        </FinalForm>
    );
};
