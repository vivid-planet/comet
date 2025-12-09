import { defineConfig } from "@comet/admin-generator";
import { type GQLTenantScope } from "@src/graphql.generated";

export default defineConfig<GQLTenantScope>({
    type: "grid",
    gqlType: "TenantScope",
    fragmentName: "TenantScopeGrid",
    queryParamsPrefix: "tenant-scopes",
    newEntryText: "Add Scope",
    delete: false, // It is disabled for the time being. We first need to consider whether we want to delete it and then clear all tables. Or whether there will perhaps only be an archive function.
    columns: [
        {
            type: "text",
            name: "domain",
            headerName: "Domain",
        },
        {
            type: "text",
            name: "language",
            headerName: "Language",
        },
    ],
});
