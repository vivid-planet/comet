import { BooleanFilter, createEnumFilter, DateFilter, NumberFilter, StringFilter } from "@comet/cms-api";
import { Field, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

import { ProductType } from "../../entities/product.entity";

@InputType()
class ProductTypeEnumFilter extends createEnumFilter(ProductType) {}

@InputType()
export class ProductFilter {
    @Field(() => StringFilter, { nullable: true })
    @ValidateNested()
    @Type(() => StringFilter)
    title?: StringFilter;

    @Field(() => StringFilter, { nullable: true })
    @ValidateNested()
    @Type(() => StringFilter)
    slug?: StringFilter;

    @Field(() => StringFilter, { nullable: true })
    @ValidateNested()
    @Type(() => StringFilter)
    description?: StringFilter;

    @Field(() => ProductTypeEnumFilter, { nullable: true })
    @ValidateNested()
    @Type(() => ProductTypeEnumFilter)
    type?: ProductTypeEnumFilter;

    @Field(() => NumberFilter, { nullable: true })
    @ValidateNested()
    @Type(() => NumberFilter)
    price?: NumberFilter;

    @Field(() => BooleanFilter, { nullable: true })
    @ValidateNested()
    @Type(() => BooleanFilter)
    inStock?: BooleanFilter;

    @Field(() => DateFilter, { nullable: true })
    @ValidateNested()
    @Type(() => DateFilter)
    createdAt?: DateFilter;

    @Field(() => DateFilter, { nullable: true })
    @ValidateNested()
    @Type(() => DateFilter)
    updatedAt?: DateFilter;

    @Field(() => [ProductFilter], { nullable: true })
    @Type(() => ProductFilter)
    @ValidateNested({ each: true })
    and?: ProductFilter[];

    @Field(() => [ProductFilter], { nullable: true })
    @Type(() => ProductFilter)
    @ValidateNested({ each: true })
    or?: ProductFilter[];
}
