import { MailerService, RequiredPermission } from "@comet/cms-api";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Args, Field, Mutation, ObjectType, Query, Resolver } from "@nestjs/graphql";

import { Product, ProductStatus } from "./entities/product.entity";
import { ProductInput } from "./generated/dto/product.input";
import { ProductPublishedMail } from "./product-published.mail";

@ObjectType()
class ValidationResponse {
    @Field()
    ok: boolean;

    @Field({ nullable: true })
    errorCode?: string;
}

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

    @Query(() => ValidationResponse)
    async validateProduct(@Args("input", { type: () => ProductInput }) input: ProductInput): Promise<ValidationResponse> {
        if (input.title.length < 3) {
            return { ok: false, errorCode: "TITLE_TOO_SHORT" };
        }
        return { ok: true };
    }
}
