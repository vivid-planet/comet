import { type GridConfig } from "@comet/admin-generator";
import { type GQLProduct } from "@src/graphql.generated";

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
            secondaryText: "category.title",
        },
        {
            type: "combination",
            name: "staticSelectType",
            headerName: "Type (static select)",
            primaryText: {
                type: "staticSelect",
                field: "type",
                values: [{ value: "Cap", label: "great Cap" }, "Shirt", "Tie"],
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
                values: [
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
        {
            type: "combination",
            name: "combinedAndNestedValues",
            headerName: "Custom formatting with nested values",
            primaryText: {
                type: "formattedMessage",
                message: 'This product is named "{title}" and is a "{type}"',
                valueFields: {
                    title: "title",
                    type: "type",
                },
            },
            secondaryText: {
                type: "formattedMessage",
                message: "Price: {price} • Category: {category} • Same values again: ({nestedValues})",
                valueFields: {
                    price: {
                        type: "number",
                        field: "price",
                        currency: "EUR",
                        emptyValue: "No price set",
                    },
                    category: {
                        type: "text",
                        field: "category.title",
                        emptyValue: "No category set",
                    },
                    nestedValues: {
                        type: "formattedMessage",
                        message: "Price: {price} • Category: {category}",
                        valueFields: {
                            price: {
                                type: "number",
                                field: "price",
                                currency: "EUR",
                                emptyValue: "No price set",
                            },
                            category: {
                                type: "text",
                                field: "category.title",
                                emptyValue: "No category set",
                            },
                        },
                    },
                },
            },
        },
    ],
};
