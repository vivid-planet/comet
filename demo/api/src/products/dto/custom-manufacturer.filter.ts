import { StringFilter } from "@comet/cms-api";
import { Field, InputType } from "@nestjs/graphql";
import { ManufacturerFilter } from "@src/products/generated/dto/manufacturer.filter";
import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";

@InputType()
export class CustomManufacturerFilter extends ManufacturerFilter {
    @Field(() => StringFilter, { nullable: true })
    @ValidateNested()
    @IsOptional()
    @Type(() => StringFilter)
    id?: StringFilter;

    @Field(() => [CustomManufacturerFilter], { nullable: true })
    @Type(() => CustomManufacturerFilter)
    @ValidateNested({ each: true })
    @IsOptional()
    and?: CustomManufacturerFilter[];

    @Field(() => [CustomManufacturerFilter], { nullable: true })
    @Type(() => CustomManufacturerFilter)
    @ValidateNested({ each: true })
    @IsOptional()
    or?: CustomManufacturerFilter[];
}
