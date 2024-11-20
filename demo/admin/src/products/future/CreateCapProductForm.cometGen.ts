import { future_FormConfig as FormConfig } from "@comet/cms-admin";
import { GQLProduct } from "@src/graphql.generated";

export const CreateCapProductForm: FormConfig<GQLProduct> = {
    type: "form",
    gqlType: "Product",
    mode: "add",
    fragmentName: "CreateCapProductFormDetails",
    fields: [
        {
            type: "text",
            name: "title",
            label: "Titel", // default is generated from name (camelCaseToHumanReadable)
            required: true, // default is inferred from gql schema
            validate: { name: "validateTitle", import: "./validateTitle" },
        },
        { type: "text", name: "slug" },
        { type: "text", name: "description", label: "Description", multiline: true },
        { type: "asyncSelect", name: "category", rootQuery: "productCategories" },
        { type: "boolean", name: "inStock" },
        { type: "date", name: "availableSince", startAdornment: { icon: "CalendarToday" } },
        { type: "block", name: "image", label: "Image", block: { name: "DamImageBlock", import: "@comet/cms-admin" } },
    ],
};
