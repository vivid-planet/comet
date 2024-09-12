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
            name: "staticSelectType",
            headerName: "Type (static select)",
            primaryText: {
                type: "staticSelect",
                field: "type",
                options: [
                    { value: "Cap", label: "This is a cap" },
                    { value: "Shirt", label: "Look at this shirt" },
                    { value: "Tie", label: "Wow, a tie" },
                ],
            },
            secondaryText: "type",
        },
        {
            type: "combination",
            name: "staticSelectInStock",
            headerName: "In stock (static select)",
            primaryText: {
                type: "staticSelect",
                field: "inStock",
                emptyValue: "No stock info",
                options: [
                    { value: true, label: "It's in stock :D" },
                    { value: false, label: "No longer available :(" },
                ],
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
