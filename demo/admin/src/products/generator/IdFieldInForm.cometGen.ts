import { defineConfig } from "@comet/admin-generator";
import { DamImageBlock } from "@comet/cms-admin";
import { type GQLProduct } from "@src/graphql.generated";

export default defineConfig<GQLProduct>({
    type: "form",
    gqlType: "Product",
    fragmentName: "IdFieldInForm",
    fields: [
        { type: "text", name: "id", label: "ID", readOnly: true },
        { type: "text", name: "title", label: "Title", required: true },
        { type: "block", name: "image", label: "Image", block: DamImageBlock },
    ],
});
