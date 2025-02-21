import { future_GridConfig as GridConfig } from "@comet/cms-admin";
import { GQLProduct } from "@src/graphql.generated";

export const StaticSelectFieldsTestProductsGrid: GridConfig<GQLProduct> = {
    type: "grid",
    gqlType: "Product",
    fragmentName: "StaticSelectFieldsTestProductsGridFuture",
    toolbarActionProp: true,
    rowActionProp: true,
    columns: [
        { type: "text", name: "title", headerName: "Titel" },
        {
            type: "staticSelect",
            name: "inStock",
            headerName: "In stock",
            values: [{ value: true, label: "In Stock" }, false],
        },
        {
            type: "staticSelect",
            name: "status",
            headerName: "Status",
            values: [{ value: "Published", label: "It's published" }, { value: "Unpublished", label: "It's unpublished" }, "Deleted"],
        },
        {
            type: "staticSelect",
            name: "soldCount",
            headerName: "Sold Amount",
            values: [
                { value: 0, label: { primaryText: "Nothing has ever been sold", secondaryText: "We need to do better", icon: "Error" } },
                {
                    value: 100,
                    label: {
                        primaryText: "Yay, exactly 100 sold",
                        icon: "Favorite",
                    },
                },
                200,
                300,
            ],
        },
    ],
};
