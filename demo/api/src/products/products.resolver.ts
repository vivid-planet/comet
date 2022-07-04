import { AllowForRole, SortDirection } from "@comet/cms-api"; 
import { FindOptions } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Args, ID, Int, Mutation, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { ProductInput } from "@src/products/dto/product.input";
import { Product } from "@src/products/entities/product.entity";
import { ProductsService } from "@src/products/products.service";

import { PaginatedProducts } from "./dto/paginated-product";
import { ProductsArgs } from "./dto/products.args";

// @AllowForRole("Admin", "Superuser")
@Resolver(() => Product)
export class ProductsResolver {
    constructor(
        private readonly productsService: ProductsService,
        @InjectRepository(Product) private readonly repository: EntityRepository<Product>,
    ) {}

    @Mutation(() => Product)
    async addProduct(@Args("data", { type: () => ProductInput }) data: ProductInput): Promise<Product> {
        const entity = this.repository.create(data);
        await this.repository.persistAndFlush(entity);
        return entity;
    }

    @Query(() => Product)
    async product(@Args("id", { type: () => ID }) id: string): Promise<Product> {
        return this.repository.findOneOrFail({ id });
    }

    @Query(() => PaginatedProducts)
    async products(
        @Args() { query, offset, limit, sortColumnName, sortDirection = SortDirection.DESC, filters }: ProductsArgs,
    ): Promise<PaginatedProducts> {
        const where = this.productsService.getFindCondition(query, filters);
        const options: FindOptions<Product> = { offset, limit };

        if (sortColumnName) {
            options.orderBy = { [sortColumnName]: sortDirection };
        }
        const [products, totalCount] = await this.repository.findAndCount(where, options);

        return new PaginatedProducts(products, totalCount);
    }

    @Mutation(() => Product)
    async updateProduct(
        @Args("id", { type: () => ID }) id: string,
        @Args("data", { type: () => ProductInput }) data: ProductInput,
    ): Promise<Product> {
        const entity = await this.repository.findOneOrFail(id);
        entity.assign(data);
        await this.repository.persistAndFlush(entity);
        return entity;
    }

    @AllowForRole("Admin")
    @Mutation(() => Boolean)
    async deleteProduct(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
        const product = await this.repository.findOneOrFail(id);
        await this.repository.removeAndFlush(product);
        return true;
    }

    @AllowForRole("Admin")
    @ResolveField(() => Int)
    sales(): number {
        return 0;
    }
}
