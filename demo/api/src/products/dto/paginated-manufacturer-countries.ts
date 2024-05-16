import { PaginatedResponseFactory } from "@comet/cms-api";
import { ObjectType } from "@nestjs/graphql";
import { ManufacturerCountry } from "@src/products/entities/manufacturer-country.entity";

@ObjectType()
export class PaginatedManufacturerCountries extends PaginatedResponseFactory.create(ManufacturerCountry) {}
