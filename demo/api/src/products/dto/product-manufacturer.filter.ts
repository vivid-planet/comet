import { Field, InputType } from "@nestjs/graphql";
import { CustomManufacturerFilter } from "@src/products/dto/custom-manufacturer.filter";
import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";

@InputType()
export class ProductManufacturerFilter {
    @Field(() => CustomManufacturerFilter, { nullable: true })
    @ValidateNested()
    @IsOptional()
    @Type(() => CustomManufacturerFilter)
    equal?: CustomManufacturerFilter;

    @Field(() => CustomManufacturerFilter, { nullable: true })
    @ValidateNested()
    @IsOptional()
    @Type(() => CustomManufacturerFilter)
    notEqual?: CustomManufacturerFilter;
}
