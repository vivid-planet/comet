import {
    BooleanFilter,
    DateFilter,
    DateTimeFilter,
    extractGraphqlFields,
    filtersToMikroOrmQuery,
    NumberFilter,
    RequiredPermission,
    searchToMikroOrmQuery,
    StringFilter,
} from "@comet/cms-api";
import { isEnumFilter } from "@comet/cms-api/lib/common/filter/enum.filter.factory";
import { filterToMikroOrmQuery } from "@comet/cms-api/lib/common/filter/mikro-orm";
import { getCrudSearchFieldsFromMetadata } from "@comet/cms-api/lib/generator/utils/search-fields-from-metadata";
import { expr, FindOptions, ObjectQuery } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Args, Info, Query, Resolver } from "@nestjs/graphql";
import { ProductManufacturerFilter } from "@src/products/dto/product-manufacturer.filter";
import { Manufacturer } from "@src/products/entities/manufacturer.entity";
import { GraphQLResolveInfo } from "graphql";

import { ProductsByCustomFilterArgs } from "./dto/products-by-custom-filter.args";
import { Product } from "./entities/product.entity";
import { PaginatedProducts } from "./generated/dto/paginated-products";

@Resolver(() => Product)
@RequiredPermission(["products"], { skipScopeCheck: true })
export class ProductResolver {
    constructor(private readonly entityManager: EntityManager, @InjectRepository(Product) private readonly repository: EntityRepository<Product>) {}

    @Query(() => PaginatedProducts)
    async productsByCustomFilter(
        @Args() { status, search, filter, sort, offset, limit }: ProductsByCustomFilterArgs,
        @Info() info: GraphQLResolveInfo,
    ): Promise<PaginatedProducts> {
        const where = this.gqlArgsToMikroOrmQuery({ search, filter }, this.repository);
        where.status = { $in: status };

        const fields = extractGraphqlFields(info, { root: "nodes" });
        const populate: string[] = [];
        if (fields.includes("category")) {
            populate.push("category");
        }
        if (fields.includes("manufacturer")) {
            populate.push("manufacturer");
        }
        if (fields.includes("priceList")) {
            populate.push("priceList");
        }
        if (fields.includes("colors")) {
            populate.push("colors");
        }
        if (fields.includes("variants")) {
            populate.push("variants");
        }
        if (fields.includes("tagsWithStatus")) {
            populate.push("tagsWithStatus");
        }
        if (fields.includes("tags")) {
            populate.push("tags");
        }
        if (fields.includes("datasheets")) {
            populate.push("datasheets");
        }
        if (fields.includes("statistics")) {
            populate.push("statistics");
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options: FindOptions<Product, any> = { offset, limit, populate };

        if (sort) {
            options.orderBy = sort.map((sortItem) => {
                return {
                    [sortItem.field]: sortItem.direction,
                };
            });
        }

        const [entities, totalCount] = await this.repository.findAndCount(where, options);
        return new PaginatedProducts(entities, totalCount);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gqlArgsToMikroOrmQuery({ search, filter }: { search?: string; filter?: any }, repository: EntityRepository<any>): ObjectQuery<any> {
        const andFilters = [];

        const metadata = repository.getEntityManager().getMetadata().get(repository.getEntityName());
        if (search) {
            const crudSearchPropNames = getCrudSearchFieldsFromMetadata(metadata);
            if (crudSearchPropNames.length == 0) {
                throw new Error("Entity has no searchable fields");
            }
            andFilters.push(searchToMikroOrmQuery(search, crudSearchPropNames));
        }

        if (filter) {
            andFilters.push(
                filtersToMikroOrmQuery(filter, {
                    metadata,
                    applyFilter: (
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        acc: ObjectQuery<any>,
                        filterValue: StringFilter | NumberFilter | DateTimeFilter | DateFilter | BooleanFilter | ProductManufacturerFilter | unknown,
                        filterKey: string,
                    ) => {
                        if (filterValue instanceof ProductManufacturerFilter) {
                            if (filterValue.equal !== undefined) {
                                const query = filtersToMikroOrmQuery(filterValue.equal);
                                if (Object.keys(query).length > 0) {
                                    acc[filterKey] = query;
                                }
                            }
                            if (filterValue.notEqual !== undefined) {
                                const query = filtersToMikroOrmQuery(filterValue.notEqual);
                                if (Object.keys(query).length > 0) {
                                    const qb = this.entityManager.createQueryBuilder(Manufacturer).select("id").where(query);
                                    acc[expr(`${filterKey} not in (${qb.getFormattedQuery()})`)] = true;
                                }
                            }
                        } else if (
                            filterValue instanceof StringFilter ||
                            filterValue instanceof NumberFilter ||
                            filterValue instanceof DateFilter ||
                            filterValue instanceof DateTimeFilter ||
                            filterValue instanceof BooleanFilter ||
                            isEnumFilter(filterValue)
                        ) {
                            const query = filterToMikroOrmQuery(filterValue, filterKey);
                            if (Object.keys(query).length > 0) {
                                acc[filterKey] = query;
                            }
                        } else {
                            // filterValue can also be "unknown"
                        }
                    },
                }),
            );
        }

        return andFilters.length > 0 ? { $and: andFilters } : {};
    }
}
