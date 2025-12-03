import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsDateString, IsOptional } from "class-validator";
import { GraphQLLocalDate } from "graphql-scalars";

@InputType()
export class DateFilter {
    @Field(() => GraphQLLocalDate, { nullable: true })
    @IsOptional()
    @IsDateString()
    equal?: string;

    @Field(() => GraphQLLocalDate, { nullable: true })
    @IsOptional()
    @IsDateString()
    lowerThan?: string;

    @Field(() => GraphQLLocalDate, { nullable: true })
    @IsOptional()
    @IsDateString()
    greaterThan?: string;

    @Field(() => GraphQLLocalDate, { nullable: true })
    @IsOptional()
    @IsDateString()
    lowerThanEqual?: string;

    @Field(() => GraphQLLocalDate, { nullable: true })
    @IsOptional()
    @IsDateString()
    greaterThanEqual?: string;

    @Field(() => GraphQLLocalDate, { nullable: true })
    @IsOptional()
    @IsDateString()
    notEqual?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    isEmpty?: boolean;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    isNotEmpty?: boolean;
}
