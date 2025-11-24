import { MailerService, RequiredPermission } from "@comet/cms-api";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Mutation, Resolver } from "@nestjs/graphql";

import { Product, ProductStatus } from "./entities/product.entity";
import { ProductPublishedMail } from "./product-published.mail";

@Resolver(() => Product)
@RequiredPermission(["products"], { skipScopeCheck: true })
export class CustomProductResolver {
    constructor(
        @InjectRepository(Product) private readonly repository: EntityRepository<Product>,
        private readonly mailerService: MailerService,
        private readonly productPublishedMail: ProductPublishedMail,
    ) {}

    @Mutation(() => Boolean)
    async publishAllProducts(): Promise<boolean> {
        const countProductPublished = await this.repository.count({ status: { $ne: ProductStatus.Published } });
        await this.repository.nativeUpdate({ status: { $ne: ProductStatus.Published } }, { status: ProductStatus.Published });

        await this.mailerService.sendMail({
            ...(await this.productPublishedMail.generateMail({
                recipient: { name: "Product Manager", email: "product-manager@comet-dxp.com", language: "en" },
                countProductPublished: countProductPublished,
            })),
        });
        return true;
    }
}
