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
                type: "group",
                fields: [
                    {
                        type: "number",
                        field: "price",
                        currency: "EUR",
                    },
                    {
                        type: "staticSelect",
                        field: "type",
                        values: typeValues,
                    },
                    {
                        type: "text",
                        field: "category.title",
                    },
                    {
                        type: "staticSelect",
                        field: "inStock",
                        values: [
                            { value: true, label: "In stock" },
                            { value: false, label: "Out of stock" },
                        ],
                    },
                ],
            },
            visible: "down('md')",
            sortBy: ["title", "price", "type", "category", "inStock"],
        },
        { type: "text", name: "title", headerName: "Titel", minWidth: 200, maxWidth: 250, visible: "up('md')" },
        { type: "text", name: "description", headerName: "Description" },
        { type: "number", name: "price", headerName: "Price", maxWidth: 150, headerInfoTooltip: "Price in EUR", visible: "up('md')" },
        {
            type: "staticSelect",
            name: "inStock",
            headerName: "In stock",
            flex: 1,
            minWidth: 80,
            visible: "up('md')",
            values: [
                {
                    value: "true",
                    label: {
                        primaryText: "In stock",
                        icon: { name: "StateFilled", color: "success" },
                    },
                },
                {
                    value: "false",
                    label: {
                        primaryText: "Out of stock",
                        icon: { name: "StateFilled", color: "error" },
                    },
                },
            ],
        },
        { type: "staticSelect", name: "type", maxWidth: 150, values: typeValues, visible: "up('md')" },
        { type: "date", name: "availableSince", width: 140 },
        { type: "dateTime", name: "createdAt", width: 170 },
        {
            type: "actions",
            width: 116,
            component: { name: "ProductsGridPreviewAction", import: "../../ProductsGridPreviewAction" },
        },
    ],
};
