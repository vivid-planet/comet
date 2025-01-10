import { future_GridConfig as GridConfig } from "@comet/cms-admin";
import { GQLProductVariant } from "@src/graphql.generated";

export const ProductVariantsGrid: GridConfig<GQLProductVariant> = {
    type: "grid",
    gqlType: "ProductVariant",
    fragmentName: "ProductVariantsGridFuture", // configurable as it must be unique across project
    queryParamsPrefix: "product-variants",
    columns: [
        { type: "text", name: "name", headerName: "Name" },
        { type: "date", name: "createdAt", headerName: "Created at" },
    ],
};
