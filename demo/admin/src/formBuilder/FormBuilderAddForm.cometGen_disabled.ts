/**
 * TODO: Re-enable this file when the missing `block` value in `output` can be handled by the generator
 *
 * const output = {
 *     blocks: { blocks: [] }, // This line is missing from the generated file
 *     ...formValues,
 * };
 */
import { future_FormConfig as FormConfig } from "@comet/cms-admin";
import { GQLFormBuilder } from "@src/graphql.generated";

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
