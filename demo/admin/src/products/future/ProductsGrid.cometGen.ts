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
        { type: "boolean", name: "inStock", headerName: "In stock", width: 90 },
        {
            type: "combination",
            name: "overview",
            headerName: "Overview",
            getPrimaryText: ({ title }) => title,
            getSecondaryText: (row, intl) =>
                [
                    typeof row.price === "number" && intl.formatNumber(row.price, { style: "currency", currency: "EUR" }),
                    row.type,
                    row.category?.title,
                    row.inStock
                        ? intl.formatMessage({ id: "product.inStock", defaultMessage: "In Stock" })
                        : intl.formatMessage({ id: "product.outOfStock", defaultMessage: "Out of Stock" }),
                ]
                    .filter(Boolean)
                    .join(" • "),
        },
        { type: "text", name: "title", headerName: "Titel", minWidth: 200, maxWidth: 250 },
        { type: "text", name: "description", headerName: "Description" },
        { type: "number", name: "price", headerName: "Price", maxWidth: 150 },
        { type: "staticSelect", name: "type", maxWidth: 150 /*, values: from gql schema (TODO overridable)*/ },
        { type: "date", name: "availableSince", width: 140 },
        { type: "dateTime", name: "createdAt", width: 170 },
    ],
};
