import { OffsetBasedPaginationArgs, SortArgs } from "@comet/cms-api";
import { ArgsType, Field, InputType, IntersectionType, registerEnumType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";

//TODO move into library
export enum FilterItemsOperator {
    And = "And",
    Or = "Or",
}
registerEnumType(FilterItemsOperator, {
    name: "FilterItemsOperator",
});

//TODO move into library
export enum FilterOperation {
    Contains = "Contains",
    StartsWith = "StartsWith",
    EndsWith = "EndsWith",
    IsEqual = "IsEqual",
    LessThan = "LessThan",
    GreaterThan = "GreaterThan",
    LessOrEqual = "LessOrEqual",
    GreaterOrEqual = "GreaterOrEqual",
    NotEqual = "NotEqual",
    IsAnyOf = "IsAnyOf",
    IsEmpty = "IsEmpty",
    NotEmpty = "NotEmpty",
}
registerEnumType(FilterOperation, {
    name: "FilterOperation",
});

export enum ProductFilterField {
    Name = "name",
    Description = "description",
}
registerEnumType(ProductFilterField, {
    name: "ProductFilterField",
});

@InputType()
export class ProductFilterItem {
    @Field(() => ProductFilterField)
    @IsEnum(ProductFilterField)
    field: ProductFilterField;

    @Field()
    @IsString()
    value: string;

    @Field(() => FilterOperation)
    @IsEnum(FilterOperation)
    operation: FilterOperation;
}

@InputType()
export class ProductFilterItems {
    @Field(() => [ProductFilterItem])
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductFilterItem)
    filterItems: ProductFilterItem[];

    @Field(() => FilterItemsOperator)
    @IsEnum(FilterItemsOperator)
    filterItemsOperator: FilterItemsOperator;
}

@ArgsType()
export class ProductsArgs extends IntersectionType(OffsetBasedPaginationArgs, SortArgs) {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    query?: string;

    @Field(() => ProductFilterItems, { nullable: true })
    @ValidateNested()
    @Type(() => ProductFilterItems)
    filters?: ProductFilterItems;
}
