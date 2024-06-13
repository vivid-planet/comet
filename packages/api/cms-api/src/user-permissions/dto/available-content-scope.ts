import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";

import { ContentScope } from "../interfaces/content-scope.interface";

@ObjectType()
export class AvailableContentScope {
    @Field(() => GraphQLJSONObject)
    contentScope: ContentScope;

    @Field(() => String, { nullable: true })
    label: string | null;
}
