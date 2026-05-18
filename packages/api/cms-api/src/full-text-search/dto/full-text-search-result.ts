import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-scalars";

@ObjectType("FullTextSearchResult")
export class FullTextSearchResultObject {
    @Field()
    id: string;

    @Field()
    entityName: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    secondaryInformation?: string;

    @Field(() => GraphQLJSONObject, { nullable: true })
    scope?: Record<string, unknown>;
}
