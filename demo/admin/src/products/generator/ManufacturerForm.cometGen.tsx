import { defineConfig } from "@comet/admin-generator";
import { type GQLManufacturer } from "@src/graphql.generated";

export default defineConfig<GQLManufacturer>({
    type: "form",
    gqlType: "Manufacturer",
    fields: [
        { type: "text", name: "name" },
        { type: "text", name: "addressAsEmbeddable.country" },
        { type: "text", name: "addressAsEmbeddable.street" },
        { type: "text", name: "addressAsEmbeddable.streetNumber" },
        { type: "text", name: "addressAsEmbeddable.zip" },
        { type: "text", name: "addressAsEmbeddable.alternativeAddress.country" },
        { type: "text", name: "addressAsEmbeddable.alternativeAddress.street" },
        { type: "text", name: "addressAsEmbeddable.alternativeAddress.streetNumber" },
        { type: "text", name: "addressAsEmbeddable.alternativeAddress.zip" },
    ],
});
