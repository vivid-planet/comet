import { CheckboxField, FinalForm, TextField } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import React from "react";

storiesOf("@comet/admin/form", module).add("Conditional required fields", function () {
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
});
