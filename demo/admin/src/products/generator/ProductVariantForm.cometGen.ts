import { defineConfig } from "@comet/admin-generator";
import { DamImageBlock } from "@comet/cms-admin";
import { type GQLProductVariant } from "@src/graphql.generated";

export default defineConfig<GQLProductVariant>({
    type: "form",
    gqlType: "ProductVariant",
    fragmentName: "ProductVariantForm",
    navigateOnCreate: false,
    fields: [
        { type: "text", name: "name" },
        { type: "block", name: "image", label: "Image", block: DamImageBlock },
    ],
});
