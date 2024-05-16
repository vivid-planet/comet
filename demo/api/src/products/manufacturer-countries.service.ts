import { filtersToMikroOrmQuery, searchToMikroOrmQuery } from "@comet/cms-api";
import { ObjectQuery } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";

import { ManufacturerCountryFilter } from "./dto/manufacturer-country.filter";
import { ManufacturerCountry } from "./entities/manufacturer-country.entity";

@Injectable()
export class ManufacturerCountriesService {
    getFindCondition(options: { search?: string; filter?: ManufacturerCountryFilter }): ObjectQuery<ManufacturerCountry> {
        const andFilters = [];

        if (options.search) {
            andFilters.push(searchToMikroOrmQuery(options.search, ["country"]));
        }

        if (options.filter) {
            andFilters.push(filtersToMikroOrmQuery(options.filter));
        }

        return andFilters.length > 0 ? { $and: andFilters } : {};
    }
}
