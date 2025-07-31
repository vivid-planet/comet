import { Field, InputType } from "@nestjs/graphql";
import { IsOptional } from "class-validator";
import { GraphQLJSONObject } from "graphql-scalars";

import { ContentScope } from "../interfaces/content-scope.interface";

@InputType({ isAbstract: true })
export class ContentScopeFilter {
    @Field(() => [GraphQLJSONObject], { nullable: true })
    @IsOptional()
    isAnyOf?: ContentScope[];

    @Field(() => GraphQLJSONObject, { nullable: true })
    @IsOptional()
    equal?: ContentScope;

    @Field(() => GraphQLJSONObject, { nullable: true })
    @IsOptional()
    notEqual?: ContentScope;
}
