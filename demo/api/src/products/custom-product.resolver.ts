import { RequiredPermission } from "@comet/cms-api";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Mutation, Resolver } from "@nestjs/graphql";

import { Product, ProductStatus } from "./entities/product.entity";

@Resolver(() => Product)
@RequiredPermission(["products"], { skipScopeCheck: true })
export class CustomProductResolver {
    constructor(@InjectRepository(Product) private readonly repository: EntityRepository<Product>) {}

    @Mutation(() => Boolean)
    async publishAllProducts(): Promise<boolean> {
        await this.repository.nativeUpdate({ status: { $ne: ProductStatus.Published } }, { status: ProductStatus.Published });
        return true;
    }
}
