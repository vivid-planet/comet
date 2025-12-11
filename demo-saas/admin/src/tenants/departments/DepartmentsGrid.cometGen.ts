import { defineConfig } from "@comet/admin-generator";
import { type GQLDepartment } from "@src/graphql.generated";

export default defineConfig<GQLDepartment>({
    type: "grid",
    gqlType: "Department",
    fragmentName: "DepartmentGrid",
    queryParamsPrefix: "departments",
    newEntryText: "Add Department",
    delete: false, // It is disabled for the time being. We first need to consider whether we want to delete it and then clear all tables. Or whether there will perhaps only be an archive function.
    columns: [
        {
            type: "text",
            name: "name",
            headerName: "Name",
        },
    ],
});
