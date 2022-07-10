import { OffsetBasedPaginationArgs, SortArgs } from "@comet/cms-api";
import { ArgsType, Field, InputType, IntersectionType, registerEnumType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

//TODO move into library
export enum StringFilterOperation {
    Contains = "Contains",
    StartsWith = "StartsWith",
    EndsWith = "EndsWith",
    IsEqual = "IsEqual",
    NotEqual = "NotEqual",
}
registerEnumType(StringFilterOperation, {
    name: "StringFilterOperation",
});

//TODO move into library
@InputType()
export class StringFilter {
    @Field()
    @IsString()
    value: string;

    @Field(() => StringFilterOperation)
    @IsEnum(StringFilterOperation)
    operation: StringFilterOperation;
}

//TODO move into library
export enum NumberFilterOperation {
    IsEqual = "IsEqual",
    LessThan = "LessThan",
    GreaterThan = "GreaterThan",
    LessOrEqual = "LessOrEqual",
    GreaterOrEqual = "GreaterOrEqual",
    NotEqual = "NotEqual",
    /* needed?
    IsEmpty = "IsEmpty",
    NotEmpty = "NotEmpty",
    */
}
registerEnumType(NumberFilterOperation, {
    name: "NumberFilterOperation",
});

//TODO move into library
@InputType()
export class NumberFilter {
    @Field()
    @IsNumber()
    value: number;

    @Field(() => NumberFilterOperation)
    @IsEnum(NumberFilterOperation)
    operation: NumberFilterOperation;
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
