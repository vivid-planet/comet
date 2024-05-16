import { OffsetBasedPaginationArgs } from "@comet/cms-api";
import { ArgsType, Field } from "@nestjs/graphql";
import { ManufacturerCountryFilter } from "@src/products/dto/manufacturer-country.filter";
import { Type } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";

@ArgsType()
export class ManufacturerCountriesArgs extends OffsetBasedPaginationArgs {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    search?: string;

    @Field(() => ManufacturerCountryFilter, { nullable: true })
    @ValidateNested()
    @Type(() => ManufacturerCountryFilter)
    @IsOptional()
    filter?: ManufacturerCountryFilter;
}
