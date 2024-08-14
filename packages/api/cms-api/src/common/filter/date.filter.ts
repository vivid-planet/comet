import { Field, InputType } from "@nestjs/graphql";
import { IsDate, IsOptional } from "class-validator";
import { GraphQLDate } from "graphql-scalars";

@InputType()
export class DateFilter {
    @Field(() => GraphQLDate, { nullable: true })
    @IsOptional()
    @IsDate()
    equal?: Date;

    @Field(() => GraphQLDate, { nullable: true })
    @IsOptional()
    @IsDate()
    lowerThan?: Date;

    @Field(() => GraphQLDate, { nullable: true })
    @IsOptional()
    @IsDate()
    greaterThan?: Date;

    @Field(() => GraphQLDate, { nullable: true })
    @IsOptional()
    @IsDate()
    lowerThanEqual?: Date;

    @Field(() => GraphQLDate, { nullable: true })
    @IsOptional()
    @IsDate()
    greaterThanEqual?: Date;

    @Field(() => GraphQLDate, { nullable: true })
    @IsOptional()
    @IsDate()
    notEqual?: Date;
}
