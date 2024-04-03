import { future_GridConfig as GridConfig } from "@comet/cms-admin";
import { GQLProduct } from "@src/graphql.generated";

export const ProductsGrid: GridConfig<GQLProduct> = {
    type: "grid",
    gqlType: "Product",
    fragmentName: "ProductsGridFuture", // configurable as it must be unique across project
    filterProp: true,
    columns: [
        { type: "boolean", name: "inStock", headerName: "In stock", width: 90 },
        { type: "text", name: "title", headerName: "Titel", minWidth: 200, maxWidth: 250 },
        { type: "text", name: "description", headerName: "Description" },
        { type: "number", name: "price", headerName: "Price", maxWidth: 150 },
        { type: "staticSelect", name: "type", maxWidth: 150 /*, values: from gql schema (TODO overridable)*/ },
        { type: "date", name: "availableSince", width: 140 },
        { type: "dateTime", name: "createdAt", width: 170 },
    ],
    actions: {
        columnWidth: 116,
        componentImport: { name: "ProductsGridActions", import: "../ProductsGridActions" },
    },
};
