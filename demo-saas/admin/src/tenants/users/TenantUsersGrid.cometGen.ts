import { defineConfig } from "@comet/admin-generator";
import { type GQLTenantUser } from "@src/graphql.generated";

export default defineConfig<GQLTenantUser>({
    type: "grid",
    gqlType: "TenantUser",
    fragmentName: "TenantUsersGrid",
    queryParamsPrefix: "tenantUsers",
    newEntryText: "Assign User",
    edit: false,
    toolbarActionProp: true,
    columns: [
        { type: "text", name: "userName", headerName: "User" },
        { type: "text", name: "tenant.name", headerName: "Tenant" },
    ],
});
