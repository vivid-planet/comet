import { defineConfig } from "@comet/admin-generator";
import { type GQLUserPermissionsUser } from "@src/graphql.generated";

export default defineConfig<GQLUserPermissionsUser>({
    type: "grid",
    gqlType: "UserPermissionsUser",
    fragmentName: "AssignTenantUsersGrid",
    queryParamsPrefix: "assignTenantUsers",
    selectionProps: "multiSelect",
    add: false,
    edit: false,
    delete: false,
    columns: [{ type: "text", name: "name", headerName: "Name" }],
});
