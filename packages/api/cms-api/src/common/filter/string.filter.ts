import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsOptional, IsString } from "class-validator";

@InputType()
export class StringFilter {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    contains?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    notContains?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    startsWith?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    endsWith?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    equal?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    notEqual?: string;

    @Field(() => [String], { nullable: true })
    @IsOptional()
    @IsString({ each: true })
    isAnyOf?: string[];

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    isEmpty?: boolean;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    isNotEmpty?: boolean;
}
