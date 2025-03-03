import { type GridConfig } from "@comet/admin-generator";
import { type GQLProductVariant } from "@src/graphql.generated";

export const ProductVariantsGrid: GridConfig<GQLProductVariant> = {
    type: "grid",
    gqlType: "ProductVariant",
    queryParamsPrefix: "product-variants",
    columns: [
        { type: "text", name: "name", headerName: "Name" },
        { type: "date", name: "createdAt", headerName: "Created at" },
    ],
};
