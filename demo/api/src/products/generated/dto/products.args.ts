import { OffsetBasedPaginationArgs } from "@comet/cms-api";
import { ArgsType, Field } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";

import { ProductFilter } from "./product.filter";
import { ProductSort } from "./product.sort";

@ArgsType()
export class ProductsArgs extends OffsetBasedPaginationArgs {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    search?: string;

    @Field(() => ProductFilter, { nullable: true })
    @ValidateNested()
    @Type(() => ProductFilter)
    filter?: ProductFilter;

    @Field(() => [ProductSort], { nullable: true })
    @ValidateNested({ each: true })
    @Type(() => ProductSort)
    sort?: ProductSort[];
}
