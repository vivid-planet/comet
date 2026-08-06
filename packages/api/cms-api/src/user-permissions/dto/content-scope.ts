import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLJSON, GraphQLJSONObject } from "graphql-scalars";

import { ContentScope } from "../interfaces/content-scope.interface";

@ObjectType()
export class ContentScopeWithLabel {
    @Field(() => GraphQLJSONObject)
    scope: ContentScope;

    @Field(() => GraphQLJSONObject)
    label: { [key in keyof ContentScope]: string };
}

@ObjectType()
export class ContentScopeSummaryByDimension {
    @Field()
    dimension: string;

    // Number of distinct values the user has for this dimension, or the wildcard "*" if the user has access to any value.
    @Field(() => GraphQLJSON)
    count: number | "*";
}

@ObjectType()
export class ContentScopeDimension {
    @Field()
    name: string;

    @Field()
    label: string;
}
