import { defineConfig } from "@comet/admin-generator";
import { type GQLTenant } from "@src/graphql.generated";

export default defineConfig<GQLTenant>({
    type: "form",
    gqlType: "Tenant",
    fragmentName: "TenantForm",
    fields: [
        {
            type: "text",
            name: "name",
            label: "Name",
            required: true,
        },
    ],
});
