import { future_GridConfig as GridConfig } from "@comet/cms-admin";
import { GQLProductCategory } from "@src/graphql.generated";

export const ProductCategoriesGrid: GridConfig<GQLProductCategory> = {
    type: "grid",
    gqlType: "ProductCategory",
    fragmentName: "ProductCategoriesGridFuture",
    columns: [{ type: "text", name: "title" }],
};
