import { future_FormConfig as FormConfig } from "@comet/cms-admin";
import { GQLProduct } from "@src/graphql.generated";

export const ProductForm: FormConfig<GQLProduct> = {
    type: "form",
    gqlType: "Product",
    fragmentName: "IdFieldInForm",
    fields: [
        { type: "text", name: "id", label: "ID", readOnly: true },
        { type: "text", name: "title", label: "Title", required: true },
        { type: "block", name: "image", label: "Image", block: { name: "DamImageBlock", import: "@comet/cms-admin" } },
    ],
};
