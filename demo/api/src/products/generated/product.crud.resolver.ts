import { SubjectEntity, validateNotModified } from "@comet/cms-api";
import { FindOptions } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";

import { Product } from "../entities/product.entity";
import { PaginatedProducts } from "./dto/paginated-products";
import { ProductInput } from "./dto/product.input";
import { ProductsArgs } from "./dto/products.args";
import { ProductsService } from "./products.service";

@Resolver(() => Product)
export class ProductCrudResolver {
    constructor(
        private readonly productsService: ProductsService,
        @InjectRepository(Product) private readonly repository: EntityRepository<Product>,
    ) {}

    @Query(() => Product)
    @SubjectEntity(Product)
    async product(@Args("id", { type: () => ID }) id: string): Promise<Product> {
        const product = await this.repository.findOneOrFail(id);
        return product;
    }

    @Query(() => Product, { nullable: true })
    async productBySlug(@Args("slug") slug: string): Promise<Product | null> {
        const product = await this.repository.findOne({ slug });

        return product ?? null;
    }

    @Query(() => PaginatedProducts)
    async products(@Args() { search, filter, sort, offset, limit }: ProductsArgs): Promise<PaginatedProducts> {
        const where = this.productsService.getFindCondition({ search, filter });

        const options: FindOptions<Product> = { offset, limit };

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

    @Mutation(() => Product)
    async createProduct(@Args("input", { type: () => ProductInput }) input: ProductInput): Promise<Product> {
        const product = this.repository.create({
            ...input,
        });

        await this.repository.persistAndFlush(product);
        return product;
    }

    @Mutation(() => Product)
    @SubjectEntity(Product)
    async updateProduct(
        @Args("id", { type: () => ID }) id: string,
        @Args("input", { type: () => ProductInput }) input: ProductInput,
        @Args("lastUpdatedAt", { type: () => Date, nullable: true }) lastUpdatedAt?: Date,
    ): Promise<Product> {
        const product = await this.repository.findOneOrFail(id);
        if (lastUpdatedAt) {
            validateNotModified(product, lastUpdatedAt);
        }
        product.assign({
            ...input,
        });

        await this.repository.persistAndFlush(product);

        return product;
    }

    @Mutation(() => Boolean)
    @SubjectEntity(Product)
    async deleteProduct(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
        const product = await this.repository.findOneOrFail(id);
        await this.repository.removeAndFlush(product);

        return true;
    }
}
