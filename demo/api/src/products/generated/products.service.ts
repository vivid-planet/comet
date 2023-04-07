import { filtersToMikroOrmQuery, searchToMikroOrmQuery } from "@comet/cms-api";
import { ObjectQuery } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";

import { Product } from "../entities/product.entity";
import { ProductFilter } from "./dto/product.filter";

@Injectable()
export class ProductsService {
    getFindCondition(options: { search?: string; filter?: ProductFilter }): ObjectQuery<Product> {
        const andFilters = [];

        if (options.search) {
            andFilters.push(searchToMikroOrmQuery(options.search, ["title", "slug", "description", "type"]));
        }

        if (options.filter) {
            andFilters.push(filtersToMikroOrmQuery(options.filter));
        }

        return andFilters.length > 0 ? { $and: andFilters } : {};
    }
}
