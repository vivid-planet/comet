import { Field, InputType } from "@nestjs/graphql";
import { IsArray } from "class-validator";
import { GraphQLJSONObject } from "graphql-type-json";

import { ContentScope } from "../interfaces/content-scope.interface";

@InputType()
export class UserContentScopesInput {
    @Field(() => [GraphQLJSONObject], { defaultValue: [] })
    @IsArray()
    contentScopes: ContentScope[] = [];
}
