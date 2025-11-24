import { registerEnumType } from "@nestjs/graphql";

export enum UserGroup {
    all = "all",
    admin = "admin",
    editor = "editor",
}

registerEnumType(UserGroup, { name: "UserGroup" });
