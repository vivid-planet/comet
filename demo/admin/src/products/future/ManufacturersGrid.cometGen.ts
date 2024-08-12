import { future_GridConfig as GridConfig } from "@comet/cms-admin";
import { GQLManufacturer } from "@src/graphql.generated";

export const ManufacturersGrid: GridConfig<GQLManufacturer> = {
    type: "grid",
    gqlType: "Manufacturer",
    fragmentName: "ManufacturersGridFuture", // configurable as it must be unique across project
    columns: [
        { type: "text", name: "id", headerName: "ID" },
        { type: "text", name: "name", headerName: "Name" },
        { type: "text", name: "address.street", headerName: "Street" },
        { type: "number", name: "address.streetNumber", headerName: "Street number" },
        { type: "text", name: "address.alternativeAddress.street", headerName: "Alt-Street" },
        { type: "number", name: "address.alternativeAddress.streetNumber", headerName: "Alt-Street number" },
        { type: "text", name: "addressAsEmbeddable.street", headerName: "Street 2" },
        { type: "number", name: "addressAsEmbeddable.streetNumber", headerName: "Street number 2" },
        { type: "text", name: "addressAsEmbeddable.alternativeAddress.street", headerName: "Alt-Street 2" },
        { type: "number", name: "addressAsEmbeddable.alternativeAddress.streetNumber", headerName: "Alt-Street number 2" },
    ],
};
