import { type FormConfig } from "@comet/admin-generator";
import { type GQLProduct } from "@src/graphql.generated";

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
