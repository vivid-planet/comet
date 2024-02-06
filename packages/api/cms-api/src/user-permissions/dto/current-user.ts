import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";

import { CurrentUserInterface } from "../../auth/current-user/current-user";
import { ContentScope } from "../interfaces/content-scope.interface";

@ObjectType()
export class CurrentUserPermission {
    @Field()
    permission: string;
    @Field(() => [GraphQLJSONObject], { nullable: true })
    contentScopes: ContentScope[] | null;
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
    availableContentScopes: ContentScope[];
    @Field(() => [GraphQLJSONObject], { nullable: true })
    contentScopes: ContentScope[] | null;
    @Field(() => [CurrentUserPermission])
    permissions: CurrentUserPermission[];
}
