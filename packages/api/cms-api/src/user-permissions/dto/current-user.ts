import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";

import { CurrentUserInterface } from "../../auth/current-user/current-user";
import { ContentScope } from "../interfaces/content-scope.interface";

@ObjectType()
export class CurrentUserPermission {
    @Field()
    permission: string;
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
    @Field(() => [CurrentUserPermission])
    permissions: CurrentUserPermission[];
}
