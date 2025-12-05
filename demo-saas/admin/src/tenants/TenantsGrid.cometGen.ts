import { defineConfig } from "@comet/admin-generator";
import { type GQLTenant } from "@src/graphql.generated";

export default defineConfig<GQLTenant>({
    type: "grid",
    gqlType: "Tenant",
    fragmentName: "TenantsGrid",
    columns: [
        {
            type: "text",
            name: "name",
            headerName: "Name",
        },
    ],
});
