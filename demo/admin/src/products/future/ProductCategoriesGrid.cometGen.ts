import { future_GridConfig as GridConfig } from "@comet/cms-admin";
import { GQLProductCategory } from "@src/graphql.generated";

export const ProductCategoriesGrid: GridConfig<GQLProductCategory> = {
    type: "grid",
    gqlType: "ProductCategory",
    fragmentName: "ProductCategoriesGridFuture",
    queryParamsPrefix: "productCategories",
    rowReordering: true,
    columns: [
        {
            type: "text",
            name: "title",
            headerName: "Title",
        },
        {
            type: "text",
            name: "slug",
            headerName: "Slug",
        },
        {
            type: "number",
            name: "position",
            headerName: "Position",
        },
    ],
};
