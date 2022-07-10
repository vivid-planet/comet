import { FilterQuery } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Product } from "@src/products/entities/product.entity";

import { NumberFilter, NumberFilterOperation, ProductFilter, StringFilter, StringFilterOperation } from "./dto/products.args";

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
                        if (filterProperty.operation == StringFilterOperation.Contains) {
                            acc[filterPropertyName] = { $ilike: `%${filterProperty.value}%` };
                        } else if (filterProperty.operation == StringFilterOperation.StartsWith) {
                            acc[filterPropertyName] = { $ilike: `${filterProperty.value}%` };
                        } else if (filterProperty.operation == StringFilterOperation.EndsWith) {
                            acc[filterPropertyName] = { $ilike: `%${filterProperty.value}` };
                        } else if (filterProperty.operation == StringFilterOperation.IsEqual) {
                            acc[filterPropertyName] = { $eq: filterProperty.value };
                        } else if (filterProperty.operation == StringFilterOperation.NotEqual) {
                            acc[filterPropertyName] = { $neq: filterProperty.value };
                        } else {
                            throw new Error(`Unsupported operation ${filterProperty.operation}`);
                        }
                    } else if (filterProperty instanceof NumberFilter) {
                        if (filterProperty.operation == NumberFilterOperation.IsEqual) {
                            acc[filterPropertyName] = { $eq: filterProperty.value };
                        } else if (filterProperty.operation == NumberFilterOperation.LessThan) {
                            acc[filterPropertyName] = { $lt: filterProperty.value };
                        } else if (filterProperty.operation == NumberFilterOperation.GreaterThan) {
                            acc[filterPropertyName] = { $gt: filterProperty.value };
                        } else if (filterProperty.operation == NumberFilterOperation.LessOrEqual) {
                            acc[filterPropertyName] = { $lte: filterProperty.value };
                        } else if (filterProperty.operation == NumberFilterOperation.GreaterOrEqual) {
                            acc[filterPropertyName] = { $gte: filterProperty.value };
                        } else if (filterProperty.operation == NumberFilterOperation.NotEqual) {
                            acc[filterPropertyName] = { $ne: filterProperty.value };
                        } else {
                            throw new Error(`Unsupported operation ${filterProperty.operation}`);
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
