import { future_GridConfig as GridConfig } from "@comet/cms-admin";
import { GQLProduct } from "@src/graphql.generated";

const typeValues = [{ value: "Cap", label: "great Cap" }, "Shirt", "Tie"];

export const ProductsGrid: GridConfig<GQLProduct> = {
    type: "grid",
    gqlType: "Product",
    fragmentName: "ProductsGridFuture", // configurable as it must be unique across project
    filterProp: true,
    toolbarActionProp: true,
    rowActionProp: true,
    columns: [
        {
            type: "combination",
            name: "overview",
            headerName: "Overview",
            minWidth: 200,
            primaryText: "title",
            secondaryText: {
                type: "formattedMessage",
                message: "{price} • {type} • {category} • {inStock}",
                valueFields: {
                    price: {
                        type: "number",
                        field: "price",
                        currency: "EUR",
                        emptyValue: "No price",
                    },
                    type: {
                        type: "staticSelect",
                        field: "type",
                        values: typeValues,
                        emptyValue: "No type",
                    },
                    category: {
                        type: "string",
                        field: "category.title",
                        emptyValue: "No category",
                    },
                    inStock: {
                        type: "staticSelect",
                        field: "inStock",
                        values: [
                            { value: true, label: "In stock" },
                            { value: false, label: "Out of stock" },
                        ],
                    },
                },
            },
            visible: "down('md')",
            sortBy: ["title", "price", "type", "category", "inStock"],
        },
        { type: "text", name: "title", headerName: "Titel", minWidth: 200, maxWidth: 250, visible: "up('md')" },
        { type: "text", name: "description", headerName: "Description", visible: "up('md')" },
        { type: "number", name: "price", headerName: "Price", maxWidth: 150 },
        { type: "boolean", name: "inStock", headerName: "In stock", width: 90 },
        { type: "staticSelect", name: "type", maxWidth: 150, values: typeValues },
        { type: "date", name: "availableSince", width: 140 },
        { type: "dateTime", name: "createdAt", width: 170 },
        {
            type: "actions",
            width: 116,
            component: { name: "ProductsGridPreviewAction", import: "../../ProductsGridPreviewAction" },
        },
    ],
};
