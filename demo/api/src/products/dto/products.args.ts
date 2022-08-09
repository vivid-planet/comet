import { OffsetBasedPaginationArgs, SortArgs } from "@comet/cms-api";
import { ArgsType, Field, InputType, IntersectionType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

//TODO move into library
@InputType()
export class StringFilter {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    contains?: string;

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
}

//TODO move into library
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
    geraterThan?: number;

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
}

@InputType()
export class ProductFilter {
    @Field(() => StringFilter, { nullable: true })
    @ValidateNested()
    @Type(() => StringFilter)
    name?: StringFilter;

    @Field(() => StringFilter, { nullable: true })
    @ValidateNested()
    @Type(() => StringFilter)
    description?: StringFilter;

    @Field(() => NumberFilter, { nullable: true })
    @ValidateNested()
    @Type(() => NumberFilter)
    price?: NumberFilter;

    @Field(() => [ProductFilter], { nullable: true })
    @Type(() => ProductFilter)
    @ValidateNested({ each: true })
    and?: ProductFilter[];

    @Field(() => [ProductFilter], { nullable: true })
    @Type(() => ProductFilter)
    @ValidateNested({ each: true })
    or?: ProductFilter[];
}

@ArgsType()
export class ProductsArgs extends IntersectionType(OffsetBasedPaginationArgs, SortArgs) {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    query?: string;

    @Field(() => ProductFilter, { nullable: true })
    @ValidateNested()
    @Type(() => ProductFilter)
    filter?: ProductFilter;
}
