import { defineConfig } from "@comet/admin-generator";
import { type GQLProductHighlight } from "@src/graphql.generated";

export default defineConfig<GQLProductHighlight>({
    type: "form",
    gqlType: "ProductHighlight",
    fragmentName: "ProductHighlightFormDetails",
    fields: [
        { type: "text", name: "description" },
        {
            type: "asyncSelectFilter",
            name: "productCategory",
            rootQuery: "productCategories",
            queryField: "product.category",
            labelField: "title",
        },
        {
            type: "asyncSelect",
            name: "product",
            rootQuery: "products",
            filter: {
                type: "field",
                formFieldName: "productCategory",
                rootQueryArg: "category",
            },
        },
    ],
});
