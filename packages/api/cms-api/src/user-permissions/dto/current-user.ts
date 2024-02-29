import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";

import { ContentScope } from "../interfaces/content-scope.interface";

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
    @Field()
    language: string;
    @Field(() => [CurrentUserPermission])
    permissions: CurrentUserPermission[];
}
