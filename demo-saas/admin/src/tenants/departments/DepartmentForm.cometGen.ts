import { defineConfig } from "@comet/admin-generator";
import { type GQLDepartment } from "@src/graphql.generated";

export default defineConfig<GQLDepartment>({
    type: "form",
    gqlType: "Department",
    fragmentName: "DepartmentForm",

    fields: [
        {
            type: "text",
            name: "name",
            label: "Name",
            required: true,
        },
    ],
});
