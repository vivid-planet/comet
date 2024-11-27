import { future_FormConfig as FormConfig } from "@comet/cms-admin";

import { GQLFormBuilder } from "../graphql.generated";

export const FormBuilderAddForm: FormConfig<GQLFormBuilder> = {
    type: "form",
    gqlType: "FormBuilder",
    mode: "add",
    fragmentName: "FormBuilderAddForm",
    fields: [
        { type: "text", name: "name", label: "Name" },
        { type: "text", name: "submitButtonText", label: "Submit button text" },
    ],
};

// TODO after generating: Replace `output` with this in `handleSubmit`:
// const output = {
//     blocks: { blocks: [] }, // TODO: Make generator add this
//     ...formValues,
// };
