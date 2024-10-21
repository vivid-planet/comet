import { Field, ObjectType } from "@nestjs/graphql";

import { PaginatedResponseFactory } from "../../common/pagination/paginated-response.factory";
import { User } from "./user";

@ObjectType()
class UserPermissionsListUser extends User {
    @Field()
    countPermissions: number;

    @Field()
    countContentScopes: number;

    @Field()
    countAvailablePermissions: number;

    @Field()
    countAvailableContentScopes: number;
}

@ObjectType()
export class UserPermissionsPaginatedUserList extends PaginatedResponseFactory.create(UserPermissionsListUser) {}
