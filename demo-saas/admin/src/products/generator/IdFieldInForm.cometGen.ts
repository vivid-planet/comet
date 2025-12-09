import { defineConfig } from "@comet/admin-generator";
import { type GQLProduct } from "@src/graphql.generated";

export default defineConfig<GQLProduct>({
    type: "form",
    gqlType: "Product",
    fragmentName: "IdFieldInForm",
    fields: [
        { type: "text", name: "id", label: "ID", readOnly: true },
        { type: "text", name: "title", label: "Title", required: true },
        { type: "fileUpload", name: "image", label: "Image", maxFileSize: 1024 * 1024 * 4, download: true },
    ],
});
