import { future_GridConfig as GridConfig } from "@comet/cms-admin";
import { GQLProduct } from "@src/graphql.generated";

export const CombinationFieldsTestProductsGrid: GridConfig<GQLProduct> = {
    type: "grid",
    gqlType: "Product",
    fragmentName: "CombinationFieldsTestProductsGridFuture",
    toolbarActionProp: true,
    rowActionProp: true,
    columns: [
        {
            type: "combination",
            name: "titleAndCategory",
            headerName: "Title and Category",
            primaryText: "title",
            secondaryText: {
                type: "string",
                field: "category.title",
                emptyValue: "No category set",
            },
        },
        {
            type: "combination",
            name: "staticTextExample",
            headerName: "Static text",
            primaryText: {
                type: "static",
                text: "Lorem ipsum",
            },
            secondaryText: {
                type: "static",
                text: "Foo bar",
            },
        },
    ],
};