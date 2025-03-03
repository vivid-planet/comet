import { type CrudPageConfig } from "@comet/admin-generator";
import { type GQLManufacturer } from "@src/graphql.generated";

export const ManufacturersPage: CrudPageConfig<GQLManufacturer> = {
    type: "crudPage",
    gqlType: "Manufacturer",
    grid: {
        import: {
            name: "ManufacturersGrid",
            import: "./ManufacturersGrid",
        },
    },
    forms: {
        import: {
            name: "ManufacturerForm",
            import: "@src/products/ManufacturerForm", // TODO: Use custom/generated form: "./ManufacturerForm",
        },
    },
    addForm: {
        // variant: "dialog", // TODO: Allow rendering a form in a dialog
    },
    editForm: {
        // pageTitle: (row) => `${row.name}`, // TODO: Allow using a row-value for the title, e.g. `row.name`
    },
};
