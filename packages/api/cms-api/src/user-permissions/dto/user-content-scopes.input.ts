import { Field, InputType } from "@nestjs/graphql";
import { IsArray, IsObject } from "class-validator";
import { GraphQLJSONObject } from "graphql-scalars";

import { ContentScope } from "../interfaces/content-scope.interface";

@InputType()
export class UserContentScopesInput {
    @Field(() => [ContentScopeWithLabelInput], { defaultValue: [] })
    @IsArray()
    @IsObject({ each: true })
    contentScopes: ContentScopeWithLabelInput[] = [];
}

@InputType()
export class ContentScopeWithLabelInput {
    @Field(() => GraphQLJSONObject)
    scope: ContentScope;

    @Field(() => GraphQLJSONObject)
    label: { [key in keyof ContentScope]: string };
}
