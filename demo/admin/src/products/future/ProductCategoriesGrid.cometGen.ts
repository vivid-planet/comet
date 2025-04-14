import { defineConfig } from "@comet/admin-generator";
import { type GQLProductCategory } from "@src/graphql.generated";

export default defineConfig<GQLProductCategory>({
    type: "grid",
    gqlType: "ProductCategory",
    fragmentName: "ProductCategoriesGridFuture",
    queryParamsPrefix: "productCategories",
    rowReordering: {
        enabled: true,
    },
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
});
