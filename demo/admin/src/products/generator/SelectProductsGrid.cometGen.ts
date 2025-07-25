import { defineConfig } from "@comet/admin-generator";
import { type GQLProduct } from "@src/graphql.generated";

export default defineConfig<GQLProduct>({
    type: "grid",
    gqlType: "Product",
    fragmentName: "SelectProductsGridFuture",
    readOnly: true,
    selectionProps: "multiSelect",
    columns: [
        { type: "text", name: "title", headerName: "Titel", minWidth: 200, maxWidth: 250 },
        { type: "text", name: "description", headerName: "Description" },
        { type: "number", name: "price", headerName: "Price", maxWidth: 150 },
        { type: "staticSelect", name: "type", maxWidth: 150, values: [{ value: "cap", label: "great Cap" }, "shirt", "tie"] },
        { type: "date", name: "availableSince", width: 140 },
        { type: "dateTime", name: "createdAt", width: 170 },
    ],
});
