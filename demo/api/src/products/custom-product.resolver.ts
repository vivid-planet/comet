import { MailTemplateService, RequiredPermission } from "@comet/cms-api";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Mutation, Resolver } from "@nestjs/graphql";
import { ProductPublishedMail } from "@src/products/product-published.mail";

import { Product, ProductStatus } from "./entities/product.entity";

@Resolver(() => Product)
@RequiredPermission(["products"], { skipScopeCheck: true })
export class CustomProductResolver {
    constructor(
        @InjectRepository(Product) private readonly repository: EntityRepository<Product>,
        private readonly mailTemplateService: MailTemplateService,
        private readonly productPublishedMail: ProductPublishedMail,
    ) {}

    @Mutation(() => Boolean)
    async publishAllProducts(): Promise<boolean> {
        const countProductPublished = await this.repository.count({ status: { $ne: ProductStatus.Published } });
        await this.repository.nativeUpdate({ status: { $ne: ProductStatus.Published } }, { status: ProductStatus.Published });

        await this.mailTemplateService.sendMail(this.productPublishedMail, {
            recipient: { name: "Product Manager", email: "product-manager@comet-dxp.com" },
            countProductPublished: countProductPublished,
        });
        return true;
    }
}
