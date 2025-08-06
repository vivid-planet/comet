import { MailerService, RequiredPermission } from "@comet/cms-api";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Mutation, Resolver } from "@nestjs/graphql";

import { Product, ProductStatus } from "./entities/product.entity";

@Resolver(() => Product)
@RequiredPermission(["products"], { skipScopeCheck: true })
export class CustomProductResolver {
    constructor(
        @InjectRepository(Product) private readonly repository: EntityRepository<Product>,
        private readonly mailerService: MailerService,
    ) {}

    @Mutation(() => Boolean)
    async publishAllProducts(): Promise<boolean> {
        await this.repository.nativeUpdate({ status: { $ne: ProductStatus.Published } }, { status: ProductStatus.Published });

        await this.mailerService.sendMail({
            mailTypeForLogging: "products-published",
            to: "product-manager@comet-dxp.com",
            cc: "vice-product-manager@comet-dxp.com",
            subject: "All products have been published",
        });
        return true;
    }
}
