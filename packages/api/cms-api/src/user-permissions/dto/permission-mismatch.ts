import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-scalars";

import { ContentScope } from "../interfaces/content-scope.interface";
import { CombinedPermission, Permission } from "../user-permissions.types";

@ObjectType("UserPermissionsPermissionMismatch")
export class PermissionMismatchDto {
    @Field(() => CombinedPermission)
    permission: Permission;

    @Field(() => [GraphQLJSONObject])
    missingContentScopes: ContentScope[];
}
