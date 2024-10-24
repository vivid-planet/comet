import { future_GridConfig as GridConfig } from "@comet/cms-admin";
import { GQLProduct } from "@src/graphql.generated";

export const ProductsGrid: GridConfig<GQLProduct> = {
    type: "grid",
    gqlType: "Product",
    fragmentName: "ProductsGridFuture", // configurable as it must be unique across project
    filterProp: true,
    toolbarActionProp: true,
    rowActionProp: true,
    excelExport: true,
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
            maxWidth: 250,
            primaryText: "title",
            secondaryText: "description",
            visible: "down('md')",
            sortBy: ["title", "description"],
            disableExport: true, // TODO: Implement `valueFormatter` for type "combination"
        },
        { type: "text", name: "title", headerName: "Titel", minWidth: 200, maxWidth: 250, visible: "up('md')" },
        { type: "text", name: "description", headerName: "Description", visible: "up('md')" },
        // TODO: Allow setting options for `intl.formatNumber` through `valueFormatter` (type "number")
        { type: "number", name: "price", headerName: "Price", maxWidth: 150, headerInfoTooltip: "Price in EUR" },
        {
            // TODO: Implement showing actual label in `valueFormatter` (type "staticSelect")
            type: "staticSelect",
            name: "inStock",
            headerName: "In stock",
            flex: 1,
            minWidth: 80,
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
        { type: "staticSelect", name: "type", maxWidth: 150, values: [{ value: "Cap", label: "great Cap" }, "Shirt", "Tie"] },
        // TODO: Allow setting options for `intl.formatDate` through `valueFormatter` (type "date")
        { type: "date", name: "availableSince", width: 140 },
        // TODO: Allow setting options for `intl.formatDate` through `valueFormatter` (type "dateTime")
        { type: "dateTime", name: "createdAt", width: 170 },
        {
            type: "actions",
            component: { name: "ProductsGridPreviewAction", import: "../../ProductsGridPreviewAction" },
        },
    ],
};
