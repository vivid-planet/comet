import { FilterQuery } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Product } from "@src/products/entities/product.entity";

import { NumberFilter, ProductFilter, StringFilter } from "./dto/products.args";

@Injectable()
export class ProductsService {
    getFindCondition(query?: string, filter?: ProductFilter): FilterQuery<Product> {
        const andFilters = [];
        if (query) {
            andFilters.push({
                $or: [
                    {
                        name: {
                            $ilike: `%${query}%`,
                        },
                        description: {
                            $ilike: `%${query}%`,
                        },
                    },
                ],
            });
        }
        if (filter) {
            const convertFilter = (filter: ProductFilter): FilterQuery<Product> => {
                return Object.entries(filter).reduce((acc, [filterPropertyName, filterProperty]) => {
                    if (filterPropertyName == "and") {
                        const value = filterProperty as ProductFilter[];
                        if (value) {
                            acc.$and = value.map(convertFilter);
                        }
                    } else if (filterPropertyName == "or") {
                        const value = filterProperty as ProductFilter[];
                        if (value) {
                            acc.$or = value.map(convertFilter);
                        }
                    } else if (filterProperty instanceof StringFilter) {
                        acc[filterPropertyName] = {};
                        if (filterProperty.contains !== undefined) {
                            acc[filterPropertyName].$ilike = `%${filterProperty.contains}%`; //TODO quote
                        }
                        if (filterProperty.startsWith !== undefined) {
                            //TODO don't overwrite $ilike from contains
                            acc[filterPropertyName].$ilike = `${filterProperty.startsWith}%`;
                        }
                        if (filterProperty.endsWith !== undefined) {
                            acc[filterPropertyName].$ilike = `%${filterProperty.endsWith}`;
                        }
                        if (filterProperty.eq !== undefined) {
                            acc[filterPropertyName].$eq = filterProperty.eq;
                        }
                        if (filterProperty.neq !== undefined) {
                            acc[filterPropertyName].$neq = filterProperty.neq;
                        }
                    } else if (filterProperty instanceof NumberFilter) {
                        acc[filterPropertyName] = {};
                        if (filterProperty.eq !== undefined) {
                            acc[filterPropertyName].$eq = filterProperty.eq;
                        }
                        if (filterProperty.lt !== undefined) {
                            acc[filterPropertyName].$lt = filterProperty.lt;
                        }
                        if (filterProperty.gt !== undefined) {
                            acc[filterPropertyName].$gt = filterProperty.gt;
                        }
                        if (filterProperty.lte !== undefined) {
                            acc[filterPropertyName].$lte = filterProperty.lte;
                        }
                        if (filterProperty.gte !== undefined) {
                            acc[filterPropertyName].$gte = filterProperty.gte;
                        }
                        if (filterProperty.neq !== undefined) {
                            acc[filterPropertyName].$ne = filterProperty.neq;
                        }
                    } else {
                        throw new Error(`Unsupported filter ${filterPropertyName}`);
                    }
                    return acc;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                }, {} as FilterQuery<any>);
            };
            andFilters.push(convertFilter(filter));
        }
        return andFilters.length > 0 ? { $and: andFilters } : {};
    }
}
