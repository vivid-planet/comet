// This file has been generated by comet api-generator.
// You may choose to use this file as scaffold by moving this file out of generated folder and removing this comment.
import { filtersToMikroOrmQuery, searchToMikroOrmQuery } from "@comet/cms-api";
import { ObjectQuery } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";

import { ManufacturerCountry } from "../entities/manufacturer-country.entity";
import { ManufacturerCountryFilter } from "./dto/manufacturer-country.filter";

@Injectable()
export class ManufacturerCountriesService {
    getFindCondition(options: { search?: string; filter?: ManufacturerCountryFilter }): ObjectQuery<ManufacturerCountry> {
        const andFilters = [];

        if (options.search) {
            andFilters.push(searchToMikroOrmQuery(options.search, ["id"]));
        }

        if (options.filter) {
            andFilters.push(filtersToMikroOrmQuery(options.filter));
        }

        return andFilters.length > 0 ? { $and: andFilters } : {};
    }
}