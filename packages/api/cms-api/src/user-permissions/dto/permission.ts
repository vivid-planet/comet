import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";

@ObjectType()
export class Permission {
    @Field()
    permission: string;
    @Field(() => GraphQLJSONObject, { nullable: true })
    configuration?: Record<string, unknown>;
}
