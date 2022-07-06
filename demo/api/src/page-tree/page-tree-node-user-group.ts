import { registerEnumType } from "@nestjs/graphql";

export enum PageTreeNodeUserGroup {
    All = "All",
    Admin = "Admin",
    User = "User",
}

registerEnumType(PageTreeNodeUserGroup, { name: "PageTreeNodeUserGroup" });
