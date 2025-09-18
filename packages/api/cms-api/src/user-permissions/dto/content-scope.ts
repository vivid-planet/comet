import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-scalars";

import { ContentScope } from "../interfaces/content-scope.interface.js";

@ObjectType()
export class ContentScopeWithLabel {
    @Field(() => GraphQLJSONObject)
    scope: ContentScope;

    @Field(() => GraphQLJSONObject)
    label: { [key in keyof ContentScope]: string };
}
