import { AffectedEntity, CometValidationException, RequiredPermission } from "@comet/cms-api";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Args, ID, Int, Mutation, Resolver } from "@nestjs/graphql";

import { ProductCategory } from "./entities/product-category.entity";
import { ProductCategoriesService } from "./generated/product-categories.service";

@Resolver(() => ProductCategory)
@RequiredPermission(["products"], { skipScopeCheck: true })
export class ProductCategoryResolver {
    constructor(
        private readonly entityManager: EntityManager,
        private readonly productCategoriesService: ProductCategoriesService,
        @InjectRepository(ProductCategory) private readonly repository: EntityRepository<ProductCategory>,
    ) {}

    @Mutation(() => Boolean)
    @AffectedEntity(ProductCategory)
    async updateProductCategoryPosition(
        @Args("id", { type: () => ID }) id: string,
        @Args("position", { type: () => Int }) newPosition: number,
    ): Promise<boolean> {
        if (newPosition < 1) {
            throw new CometValidationException('"position" cannot be smaller than 1');
        }

        const productCategory = await this.repository.findOneOrFail(id);
        const { position: oldPosition } = productCategory;

        const count = await this.repository.count({}); // add filter for grouping if necessary

        if (newPosition > count) {
            throw new CometValidationException(`"position" cannot be greater than ${count}`);
        }

        if (oldPosition < newPosition) {
            // Decrement positions between oldPosition (exclusive) and newPosition (inclusive)
            await this.repository.nativeUpdate(
                { position: { $gt: oldPosition, $lte: newPosition } }, // add filter for grouping if necessary
                { position: this.entityManager.raw("position - 1") },
            );
        } else if (oldPosition > newPosition) {
            // Increment positions between newPosition (inclusive) and oldPosition (exclusive)
            await this.repository.nativeUpdate(
                { position: { $gte: newPosition, $lt: oldPosition } }, // add filter for grouping if necessary
                { position: this.entityManager.raw("position + 1") },
            );
        }

        productCategory.assign({
            position: newPosition,
        });
        await this.entityManager.flush();

        return true;
    }
}