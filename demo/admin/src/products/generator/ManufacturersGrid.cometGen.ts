import { defineConfig } from "@comet/admin-generator";
import { type GQLManufacturer } from "@src/graphql.generated";

export default defineConfig<GQLManufacturer>({
    type: "grid",
    gqlType: "Manufacturer",
    fragmentName: "ManufacturersGridFuture", // configurable as it must be unique across project
    queryParamsPrefix: "manufacturers",
    newEntryText: "Add Manufacturer",
    columns: [
        {
            type: "id",
            name: "id",
            headerName: "ID",
        },
        { type: "text", name: "name", headerName: "Name" },
        { type: "text", name: "address.street", headerName: "Street" },
        { type: "number", name: "address.streetNumber", headerName: "Street number" },
        { type: "text", name: "address.zip", headerName: "Zip" },
        { type: "text", name: "address.alternativeAddress.street", headerName: "Alt-Street", headerInfoTooltip: "Street of alternative address" },
        {
            type: "number",
            name: "address.alternativeAddress.streetNumber",
            headerName: "Alt-Street number",
            headerInfoTooltip: "Street number of alternative address",
        },
        { type: "text", name: "address.alternativeAddress.zip", headerName: "Alt-Zip", headerInfoTooltip: "Zip of alternative address" },
        { type: "text", name: "addressAsEmbeddable.street", headerName: "Street 2" },
        { type: "number", name: "addressAsEmbeddable.streetNumber", headerName: "Street number 2" },
        { type: "text", name: "addressAsEmbeddable.zip", headerName: "Zip 2" },
        { type: "text", name: "addressAsEmbeddable.alternativeAddress.street", headerName: "Alt-Street 2" },
        { type: "number", name: "addressAsEmbeddable.alternativeAddress.streetNumber", headerName: "Alt-Street number 2" },
        { type: "text", name: "addressAsEmbeddable.alternativeAddress.zip", headerName: "Alt-Zip 2" },
    ],
});
