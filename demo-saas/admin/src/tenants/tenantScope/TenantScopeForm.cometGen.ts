import { defineConfig } from "@comet/admin-generator";
import { type GQLTenantScope } from "@src/graphql.generated";

export default defineConfig<GQLTenantScope>({
    type: "form",
    gqlType: "TenantScope",
    fragmentName: "TenantScopeForm",

    fields: [
        {
            type: "text",
            name: "domain",
            label: "Domain",
            required: true,
        },
        {
            type: "text",
            name: "language",
            label: "Language",
            required: true,
        },
    ],
});
