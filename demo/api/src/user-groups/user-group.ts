import { registerEnumType } from "@nestjs/graphql";

export enum UserGroup {
    All = "All",
    Admin = "Admin",
    User = "User",
}

registerEnumType(UserGroup, { name: "UserGroup" });
