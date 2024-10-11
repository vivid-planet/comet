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
    excelExport: true,
    queryParamsPrefix: "products",
    initialSort: [
        { field: "inStock", sort: "desc" },
        { field: "price", sort: "asc" },
    ],
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
                        emptyValue: "Price unknown",
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
            disableExport: true, // TODO: Implement `valueFormatter` for type "combination"
        },
        { type: "text", name: "title", headerName: "Title", minWidth: 200, maxWidth: 250, visible: "up('md')" },
        { type: "text", name: "description", headerName: "Description" },
        // TODO: Allow setting options for `intl.formatNumber` through `valueFormatter` (type "number")
        { type: "number", name: "price", headerName: "Price", maxWidth: 150, headerInfoTooltip: "Price in EUR", visible: "up('md')" },
        {
            // TODO: Implement showing actual label in `valueFormatter` (type "staticSelect")
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
        // TODO: Implement showing actual label in `valueFormatter` (type "staticSelect")
        { type: "staticSelect", name: "type", maxWidth: 150, values: typeValues, visible: "up('md')" },
        // TODO: Allow setting options for `intl.formatDate` through `valueFormatter` (type "date")
        { type: "date", name: "availableSince", width: 140 },
        // TODO: Allow setting options for `intl.formatDate` through `valueFormatter` (type "dateTime")
        { type: "dateTime", name: "createdAt", width: 170 },
        {
            type: "text",
            name: "manufacturer.name",
            headerName: "Manufacturer",
            fieldName: "manufacturer",
            filterOperators: { name: "ManufacturerFilterOperators", import: "./ManufacturerFilter" },
        },
        {
            type: "actions",
            component: { name: "ProductsGridPreviewAction", import: "../../ProductsGridPreviewAction" },
        },
    ],
};
