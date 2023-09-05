import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";

import { CurrentUserInterface } from "../../auth/current-user/current-user";
import { ContentScope } from "../interfaces/content-scope.interface";
import { PermissionConfiguration } from "../user-permissions.types";

@ObjectType()
export class CurrentUserPermission {
    @Field()
    permission: string;
    @Field(() => GraphQLJSONObject, { nullable: true })
    configuration?: PermissionConfiguration;
    @Field()
    overrideContentScopes: boolean;
    @Field(() => [GraphQLJSONObject])
    contentScopes: ContentScope[];
}

@ObjectType()
export class CurrentUser implements CurrentUserInterface {
    @Field()
    id: string;
    @Field()
    name: string;
    @Field()
    email: string;
    @Field()
    language: string;
    @Field(() => [GraphQLJSONObject])
    contentScopes: ContentScope[];
    @Field(() => [CurrentUserPermission])
    permissions: CurrentUserPermission[];
}
