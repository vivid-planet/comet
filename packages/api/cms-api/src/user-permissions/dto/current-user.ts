import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-scalars";

import { ContentScope } from "../interfaces/content-scope.interface";
import { UserPermissionsUser } from "./user";

@ObjectType()
export class CurrentUserPermission {
    @Field()
    permission: string;
    @Field(() => [GraphQLJSONObject])
    contentScopes: ContentScope[];
}

@ObjectType()
export class CurrentUser {
    @Field()
    id: string;
    @Field()
    name: string;
    @Field()
    email: string;
    @Field(() => [CurrentUserPermission])
    permissions: CurrentUserPermission[];
    @Field({ nullable: true })
    impersonated?: boolean;
    @Field(() => UserPermissionsUser, { nullable: true })
    authenticatedUser?: UserPermissionsUser;
}
