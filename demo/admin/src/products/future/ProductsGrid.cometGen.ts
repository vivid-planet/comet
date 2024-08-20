import { future_GridConfig as GridConfig } from "@comet/cms-admin";
import { GQLProduct } from "@src/graphql.generated";

export const ProductsGrid: GridConfig<GQLProduct> = {
    type: "grid",
    gqlType: "Product",
    fragmentName: "ProductsGridFuture", // configurable as it must be unique across project
    filterProp: true,
    toolbarActionProp: true,
    rowActionProp: true,
    initialSort: [
        { field: "inStock", sort: "desc" },
        { field: "price", sort: "asc" },
    ],
    columns: [
        { type: "boolean", name: "inStock", headerName: "In stock", width: 90 },
        { type: "text", name: "title", headerName: "Titel", minWidth: 200, maxWidth: 250 },
        { type: "text", name: "description", headerName: "Description" },
        { type: "number", name: "price", headerName: "Price", maxWidth: 150, tooltipMessage: "Price in EUR"  },
        { type: "staticSelect", name: "type", maxWidth: 150, values: [{ value: "Cap", label: "great Cap" }, "Shirt", "Tie"] },
        { type: "date", name: "availableSince", width: 140 },
        { type: "dateTime", name: "createdAt", width: 170 },
        {
            type: "text",
            name: "manufacturer.name",
            headerName: "Manufacturer",
            fieldName: "manufacturer",
            filterOperators: { name: "ManufacturerFilterOperators", import: "./ManufacturerFilter" },
        },
    ],
};
