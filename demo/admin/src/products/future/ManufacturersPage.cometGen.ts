import { type PageConfig } from "@comet/admin-generator";
import { type GQLManufacturer } from "@src/graphql.generated";

import { ManufacturerForm } from "../ManufacturerForm";
import { ManufacturersGrid } from "./generated/ManufacturersGrid";

export const ManufacturersPage: PageConfig<GQLManufacturer> = {
    type: "page",
    gqlType: "Manufacturer",
    grid: {
        component: ManufacturersGrid,
    },
    forms: {
        component: ManufacturerForm, // TODO: Use custom/generated form: "./generated/ManufacturerForm",
    },
};
