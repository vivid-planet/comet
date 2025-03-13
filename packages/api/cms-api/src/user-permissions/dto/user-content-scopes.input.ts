import { Field, InputType } from "@nestjs/graphql";
import { IsArray, IsObject } from "class-validator";
import { GraphQLJSONObject } from "graphql-scalars";

import { ContentScopeWithLabel } from "../user-permissions.types";

@InputType()
export class UserContentScopesInput {
    @Field(() => [GraphQLJSONObject], { defaultValue: [] })
    @IsArray()
    @IsObject({ each: true })
    contentScopes: ContentScopeWithLabel[] = [];
}
