import { future_FormConfig as FormConfig } from "@comet/cms-admin";
import { GQLProduct } from "@src/graphql.generated";

export const CreateProductForm: FormConfig<GQLProduct> = {
    type: "form",
    gqlType: "Product",
    mode: "add",
    fragmentName: "ProductFormDetails", // configurable as it must be unique across project
    fields: [
        {
            type: "text",
            name: "title",
            label: "Titel", // default is generated from name (camelCaseToHumanReadable)
            required: true, // default is inferred from gql schema
            validate: { name: "validateTitle", import: "./validateTitle" },
        },
        { type: "text", name: "slug" },
        { type: "date", name: "createdAt", label: "Created", readOnly: true },
        { type: "text", name: "description", label: "Description", multiline: true },
        { type: "staticSelect", name: "type", label: "Type", required: true /*, values: from gql schema (TODO overridable)*/ },
        { type: "asyncSelect", name: "category", rootQuery: "productCategories" },
        { type: "boolean", name: "inStock" },
        { type: "date", name: "availableSince" },
        { type: "block", name: "image", label: "Image", block: { name: "DamImageBlock", import: "@comet/cms-admin" } },
    ],
};
