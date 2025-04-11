import { defineConfig } from "@comet/admin-generator";
import { type GQLManufacturer } from "@src/graphql.generated";

import { ManufacturerForm } from "../ManufacturerForm";
import { ManufacturersGrid } from "./generated/ManufacturersGrid";

export default defineConfig<GQLManufacturer>({
    type: "page",
    gqlType: "Manufacturer",
    grid: {
        component: ManufacturersGrid,
    },
    forms: {
        component: ManufacturerForm, // TODO: Use custom/generated form: "./generated/ManufacturerForm",
    },
});
