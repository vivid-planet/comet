import { future_GridConfig as GridConfig } from "@comet/cms-admin";
import { GQLProduct } from "@src/graphql.generated";

export const ProductsGrid: GridConfig<GQLProduct> = {
    type: "grid",
    gqlType: "Product",
    fragmentName: "ProductsGridFuture", // configurable as it must be unique across project
    filterProp: true,
    toolbarActionProp: true,
    rowActionProp: true,
    columns: [
        {
            type: "status",
            name: "inStock",
            headerName: "In Stock",
            flex: 1,
            minWidth: 140,
            statusMapping: {
                true: { color: "success", primaryText: "In Stock" },
                false: { color: "error", primaryText: "Out of Stock" },
            },
        },
        { type: "text", name: "title", headerName: "Titel", minWidth: 200, maxWidth: 250 },
        { type: "text", name: "description", headerName: "Description" },
        { type: "number", name: "price", headerName: "Price", maxWidth: 150 },
        { type: "staticSelect", name: "type", maxWidth: 150 /*, values: from gql schema (TODO overridable)*/ },
        { type: "date", name: "availableSince", width: 140 },
        { type: "dateTime", name: "createdAt", width: 170 },
    ],
};
