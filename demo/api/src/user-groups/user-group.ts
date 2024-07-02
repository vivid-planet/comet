import { registerEnumType } from "@nestjs/graphql";

/* eslint-disable @typescript-eslint/naming-convention */
// TODO: Replace with camelCase
export enum UserGroup {
    All = "All",
    Admin = "Admin",
    User = "User",
}
/* eslint-enable @typescript-eslint/naming-convention */

registerEnumType(UserGroup, { name: "UserGroup" });
