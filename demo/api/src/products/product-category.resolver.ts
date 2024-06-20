import { AffectedEntity, RequiredPermission } from "@comet/cms-api";
import { Reference } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Args, ID, Mutation, Resolver } from "@nestjs/graphql";
import { SetProductCategoryInput } from "@src/products/dto/set-product-category.input";
import { Product } from "@src/products/entities/product.entity";
import { ProductCategory } from "@src/products/entities/product-category.entity";

import { ProductCategoriesService } from "./generated/product-categories.service";

@Resolver(() => ProductCategory)
@RequiredPermission(["products"], { skipScopeCheck: true })
export class ProductCategoryResolver {
    constructor(
        private readonly entityManager: EntityManager,
        private readonly productCategoriesService: ProductCategoriesService,
        @InjectRepository(ProductCategory) private readonly repository: EntityRepository<ProductCategory>,
        @InjectRepository(Product) private readonly productRepository: EntityRepository<Product>,
    ) {}

    @AffectedEntity(ProductCategory)
    @Mutation(() => ProductCategory)
    async setProductCategory(
        @Args("id", { type: () => ID }) id: string,
        @Args("input", { type: () => SetProductCategoryInput }) input: SetProductCategoryInput,
    ): Promise<ProductCategory> {
        const productCategory = await this.repository.findOneOrFail(id);

        const removedProducts = await this.productRepository.find({ category: { $eq: id }, id: { $nin: input.productIds } });
        for (const product of removedProducts) {
            product.category = undefined;
        }
        const newProducts = await this.productRepository.find({ category: { $ne: id }, id: { $in: input.productIds } });
        for (const product of newProducts) {
            product.category = Reference.create(productCategory);
        }
        await this.entityManager.flush();

        return productCategory;
    }
}
