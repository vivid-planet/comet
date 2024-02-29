import { future_GridConfig as GridConfig } from "@comet/cms-admin";
import { GQLProduct } from "@src/graphql.generated";

export const ProductsGrid: GridConfig<GQLProduct> = {
    type: "grid",
    gqlType: "Product",
    fragmentName: "ProductsGridFuture", // configurable as it must be unique across project
    columns: [
        { type: "text", name: "title", headerName: "Titel" },
        { type: "text", name: "description", headerName: "Description" },
        { type: "number", name: "price", headerName: "Price", width: 140 },
        { type: "staticSelect", name: "type", width: 140 /*, values: from gql schema (TODO overridable)*/ },
        { type: "date", name: "availableSince", width: 170 },
        { type: "dateTime", name: "createdAt", width: 170 },
    ],
};
