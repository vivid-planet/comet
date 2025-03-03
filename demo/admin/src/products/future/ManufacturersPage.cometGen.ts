import { type CrudPageConfig } from "@comet/admin-generator";
import { type GQLManufacturer } from "@src/graphql.generated";

import { ManufacturerForm } from "../ManufacturerForm";
import { ManufacturersGrid } from "./generated/ManufacturersGrid";

export const ManufacturersPage: CrudPageConfig<GQLManufacturer> = {
    type: "crudPage",
    gqlType: "Manufacturer",
    grid: {
        component: ManufacturersGrid,
    },
    forms: {
        component: ManufacturerForm, // TODO: Use custom/generated form: "./generated/ManufacturerForm",
    },
};
