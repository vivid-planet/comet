import { FilterQuery, ObjectQuery } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Product } from "@src/products/entities/product.entity";

import { FilterItemsOperator, FilterOperation, ProductFilterItems } from "./dto/products.args";

@Injectable()
export class ProductsService {
    getFindCondition(query?: string, filters?: ProductFilterItems): FilterQuery<Product> {
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
        if (filters) {
            const op = filters.filterItemsOperator == FilterItemsOperator.Or ? "$or" : "$and";
            andFilters.push({
                [op]: filters.filterItems.reduce((acc, item) => {
                    if (item.operation == FilterOperation.Contains) {
                        acc.push({ [item.field]: { $ilike: `%${item.value}%` } }); //TODO escape value
                    } else if (item.operation == FilterOperation.StartsWith) {
                        acc.push({ [item.field]: { $ilike: `${item.value}%` } }); //TODO escape value
                    } else if (item.operation == FilterOperation.EndsWith) {
                        acc.push({ [item.field]: { $ilike: `%${item.value}` } }); //TODO escape value
                    } else if (item.operation == FilterOperation.IsEqual) {
                        acc.push({ [item.field]: { $eq: item.value } });
                    } else if (item.operation == FilterOperation.LessThan) {
                        acc.push({ [item.field]: { $lt: item.value } });
                    } else if (item.operation == FilterOperation.GreaterThan) {
                        acc.push({ [item.field]: { $gt: item.value } });
                    } else if (item.operation == FilterOperation.LessOrEqual) {
                        acc.push({ [item.field]: { $lte: item.value } });
                    } else if (item.operation == FilterOperation.GreaterOrEqual) {
                        acc.push({ [item.field]: { $gte: item.value } });
                    } else if (item.operation == FilterOperation.NotEqual) {
                        acc.push({ [item.field]: { $ne: item.value } });
                    } else if (item.operation == FilterOperation.IsAnyOf) {
                        acc.push({ [item.field]: { $eq: item.value } });
                    } else if (item.operation == FilterOperation.IsEmpty) {
                        acc.push({ [item.field]: { $nq: "" } });
                    } else if (item.operation == FilterOperation.NotEmpty) {
                        acc.push({ [item.field]: { $ne: "" } });
                    }
                    return acc;
                }, [] as ObjectQuery<Product>[]),
            });
        }
        return andFilters.length > 0 ? { $and: andFilters } : {};
    }
}
