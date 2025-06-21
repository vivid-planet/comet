import { Field, InputType } from "@nestjs/graphql";
import { ProductManufacturerFilter } from "@src/products/dto/product-manufacturer.filter";
import { ProductFilter } from "@src/products/generated/dto/product.filter";
import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";

@InputType()
export class CustomProductFilter extends ProductFilter {
    @Field(() => ProductManufacturerFilter, { nullable: true })
    @ValidateNested()
    @IsOptional()
    @Type(() => ProductManufacturerFilter)
    manufacturer?: ProductManufacturerFilter;

    @Field(() => [CustomProductFilter], { nullable: true })
    @Type(() => CustomProductFilter)
    @ValidateNested({ each: true })
    @IsOptional()
    and?: CustomProductFilter[];

    @Field(() => [CustomProductFilter], { nullable: true })
    @Type(() => CustomProductFilter)
    @ValidateNested({ each: true })
    @IsOptional()
    or?: CustomProductFilter[];
}
