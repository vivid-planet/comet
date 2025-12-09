import { defineConfig } from "@comet/admin-generator";
import { type GQLProductVariant } from "@src/graphql.generated";

export default defineConfig<GQLProductVariant>({
    type: "form",
    gqlType: "ProductVariant",
    fragmentName: "ProductVariantForm",
    navigateOnCreate: false,
    fields: [
        { type: "text", name: "name" },
        { type: "fileUpload", name: "image", label: "Image", maxFileSize: 1024 * 1024 * 4, download: true },
    ],
});
