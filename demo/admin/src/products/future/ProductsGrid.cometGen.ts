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
        { type: "staticSelect", name: "type", maxWidth: 150, values: [{ value: "Cap", label: "great Cap" }, "Shirt", "Tie"] },
        { type: "staticSelect", name: "additionalTypes" },
        /*
        { type: "staticSelect", name: "manufacturer" }, //many to one
        { type: "asyncSelect", name: "category" }, //many to one
        { type: "relation", name: "colors", field: "name" }, //one to many
        { type: "asyncSelect", name: "variants" }, //one to many
        { type: "relation", name: "tags" }, //many to many
        { type: "relation", name: "tagsWithStatus" }, //one to many
         */
        { type: "date", name: "availableSince", width: 140 },
        { type: "dateTime", name: "createdAt", width: 170 },
    ],
};
