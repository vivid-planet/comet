import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";

import { ContentScope } from "../interfaces/content-scope.interface";

@ObjectType()
export class CurrentUserPermission {
    @Field()
    permission: string;
    @Field(() => [GraphQLJSONObject], { nullable: true })
    contentScopes: ContentScope[] | null;
}

@ObjectType()
export class CurrentUser {
    @Field()
    id: string;
    @Field()
    name: string;
    @Field()
    email: string;
    @Field()
    language: string;

    // content scopes generally set for all permissions (or null for all content scopes)
    @Field(() => [GraphQLJSONObject], { nullable: true })
    contentScopes: ContentScope[] | null;

    // overridden content scopes for this permission or null for not overriding it
    @Field(() => [CurrentUserPermission])
    permissions: CurrentUserPermission[];

    // Only for documentation, actually a field resolver in CurrentUserResolver, only used in the admin after login, not used for permission checks
    // all combined content scopes (no null-value because the discrete values are needed, can be big)
    // @Field(() => [GraphQLJSONObject])
    // allowedContentScopes: ContentScope[];
}
