import { NumberFilter, StringFilter } from "@comet/cms-api";
import { Field, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";

@InputType()
export class ManufacturerCountryFilter {
    @Field(() => StringFilter, { nullable: true })
    @ValidateNested()
    @IsOptional()
    @Type(() => StringFilter)
    country?: StringFilter;

    @Field(() => NumberFilter, { nullable: true })
    @ValidateNested()
    @IsOptional()
    @Type(() => NumberFilter)
    used?: NumberFilter;

    @Field(() => [ManufacturerCountryFilter], { nullable: true })
    @Type(() => ManufacturerCountryFilter)
    @ValidateNested({ each: true })
    @IsOptional()
    and?: ManufacturerCountryFilter[];

    @Field(() => [ManufacturerCountryFilter], { nullable: true })
    @Type(() => ManufacturerCountryFilter)
    @ValidateNested({ each: true })
    @IsOptional()
    or?: ManufacturerCountryFilter[];
}
