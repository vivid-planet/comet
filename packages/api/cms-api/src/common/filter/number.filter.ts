import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsNumber, IsOptional } from "class-validator";

@InputType()
export class NumberFilter {
    @Field({ nullable: true })
    @IsOptional()
    @IsNumber()
    equal?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsNumber()
    lowerThan?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsNumber()
    greaterThan?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsNumber()
    lowerThanEqual?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsNumber()
    greaterThanEqual?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsNumber()
    notEqual?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    isEmpty?: boolean;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    isNotEmpty?: boolean;
}
