import { ArgsType, Field } from "@nestjs/graphql";
import { ProductsArgs } from "@src/products/generated/dto/products.args";
import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";

import { CustomProductFilter } from "./custom-product.filter";

@ArgsType()
export class ProductsByCustomFilterArgs extends ProductsArgs {
    @Field(() => CustomProductFilter, { nullable: true })
    @ValidateNested()
    @Type(() => CustomProductFilter)
    @IsOptional()
    filter?: CustomProductFilter;
}
