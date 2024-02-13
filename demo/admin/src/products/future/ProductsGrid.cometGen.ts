import { future_GridConfig as GridConfig } from "@comet/cms-admin";
import { GQLProduct } from "@src/graphql.generated";

export const ProductsGrid: GridConfig<GQLProduct> = {
    type: "grid",
    gqlType: "Product",
    fragmentName: "ProductsGridFuture", // configurable as it must be unique across project
    columns: [
        { type: "text", name: "title", headerName: "Titel", width: 150 },
        { type: "text", name: "description", headerName: "Description", width: 150 },
        { type: "number", name: "price", headerName: "Price", width: 150 },
        { type: "number", name: "packageDimensions.height", headerName: "Height", width: 50 },
        { type: "number", name: "packageDimensions.width", headerName: "Width", width: 50 },
        { type: "staticSelect", name: "type" /*, values: from gql schema (TODO overridable)*/ },
        { type: "date", name: "availableSince" },
        { type: "dateTime", name: "createdAt" },
    ],
};
