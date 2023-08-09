import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";

import { CurrentUserInterface } from "../../auth/current-user/current-user";
import { PermissionConfiguration } from "../user-permissions.types";

@ObjectType()
export class CurrentUserPermission {
    @Field()
    permission: string;
    @Field(() => GraphQLJSONObject, { nullable: true })
    configuration?: PermissionConfiguration;
    @Field()
    overrideContentScopes: boolean;
    @Field(() => [CurrentUserContentScope])
    contentScopes: CurrentUserContentScope[];
}

@ObjectType()
export class CurrentUserContentScope {
    @Field()
    scope: string;
    @Field(() => [String])
    values: string[];
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
    @Field(() => [CurrentUserContentScope])
    contentScopes: CurrentUserContentScope[];
    @Field(() => [CurrentUserPermission])
    permissions: CurrentUserPermission[];
}
