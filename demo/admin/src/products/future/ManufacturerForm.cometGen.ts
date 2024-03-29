import { future_FormConfig as FormConfig } from "@comet/cms-admin";
import { GQLManufacturer } from "@src/graphql.generated";

export const ManufacturerForm: FormConfig<GQLManufacturer> = {
    type: "form",
    gqlType: "Manufacturer",
    fragmentName: "ManufacturerFormDetails",
    fields: [
        { type: "text", name: "address.street" },
        { type: "number", name: "address.streetNumber" },
        { type: "number", name: "address.zip" },
        { type: "text", name: "address.country" },
        { type: "text", name: "address.alternativeAddress.street" },
        { type: "number", name: "address.alternativeAddress.streetNumber" },
        { type: "number", name: "address.alternativeAddress.zip" },
        { type: "text", name: "address.alternativeAddress.country" },
        { type: "text", name: "addressAsEmbeddable.street" },
        { type: "number", name: "addressAsEmbeddable.streetNumber" },
        { type: "number", name: "addressAsEmbeddable.zip" },
        { type: "text", name: "addressAsEmbeddable.country" },
        { type: "text", name: "addressAsEmbeddable.alternativeAddress.street" },
        { type: "number", name: "addressAsEmbeddable.alternativeAddress.streetNumber" },
        { type: "number", name: "addressAsEmbeddable.alternativeAddress.zip" },
        { type: "text", name: "addressAsEmbeddable.alternativeAddress.country" },
    ],
};
