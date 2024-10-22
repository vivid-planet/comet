import { Field, ObjectType } from "@nestjs/graphql";

import { PaginatedResponseFactory } from "../../common/pagination/paginated-response.factory";
import { User } from "./user";

@ObjectType()
class UserPermissionsListUser extends User {
    @Field()
    permissionsCount: number;

    @Field()
    contentScopesCount: number;
}

@ObjectType()
export class UserPermissionsPaginatedUserList extends PaginatedResponseFactory.create(UserPermissionsListUser) {
    @Field()
    availablePermissionsCount: number;

    @Field()
    availableContentScopesCount: number;
}
