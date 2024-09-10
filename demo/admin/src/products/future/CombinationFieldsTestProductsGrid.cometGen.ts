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
        {
            type: "combination",
            name: "currencyAndNumber",
            headerName: "Price (currency and number)",
            primaryText: {
                type: "number",
                field: "price",
                currency: "EUR",
                emptyValue: "No price set",
            },
            secondaryText: {
                type: "number",
                field: "price",
                decimals: 4,
            },
        },
        {
            type: "combination",
            name: "weightAndFileSize",
            headerName: "Weight and file-size format",
            primaryText: {
                type: "number",
                field: "price",
                unit: "kilogram",
            },
            secondaryText: {
                type: "number",
                field: "price",
                unit: "kilobyte",
                unitDisplay: "short",
                decimals: 1,
            },
        },
    ],
};
