import { RequiredPermission } from "@comet/cms-api";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Mutation, Resolver } from "@nestjs/graphql";
import { ProjectPermission } from "@src/common/enum/project-permission.enum";

import { Product, ProductStatus } from "./entities/product.entity";

@Resolver(() => Product)
@RequiredPermission([ProjectPermission.products], { skipScopeCheck: true })
export class CustomProductResolver {
    constructor(@InjectRepository(Product) private readonly repository: EntityRepository<Product>) {}

    @Mutation(() => Boolean)
    async publishAllProducts(): Promise<boolean> {
        await this.repository.nativeUpdate({ status: { $ne: ProductStatus.Published } }, { status: ProductStatus.Published });
        return true;
    }
}
