import { future_FormConfig as FormConfig } from "@comet/cms-admin";
import { GQLProductVariant } from "@src/graphql.generated";

export const ProductVariantForm: FormConfig<GQLProductVariant> = {
    type: "form",
    gqlType: "ProductVariant",
    fragmentName: "ProductVariantFormDetails",
    fields: [
        {
            name: "product",
            type: "asyncSelect",
            rootQuery: "products",
        },
        {
            name: "name",
            type: "text",
            label: "Name",
        },
        {
            name: "image",
            type: "block",
            label: "Image",
            block: { name: "DamImageBlock", import: "@comet/cms-admin" },
        },
    ],
};
