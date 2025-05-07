import { defineConfig } from "@comet/admin-generator";
import { type GQLProductVariant } from "@src/graphql.generated";

export default defineConfig<GQLProductVariant>({
    type: "grid",
    gqlType: "ProductVariant",
    fragmentName: "ProductVariantsGridFuture", // configurable as it must be unique across project
    queryParamsPrefix: "product-variants",
    columns: [
        { type: "text", name: "name", headerName: "Name" },
        { type: "date", name: "createdAt", headerName: "Created at" },
    ],
});
