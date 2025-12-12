import { MailerService, RequiredPermission } from "@comet/cms-api";
import { EntityManager } from "@mikro-orm/postgresql";
import { Args, Field, InputType, Mutation, ObjectType, Query, Resolver } from "@nestjs/graphql";
import { IsString } from "class-validator";

import { Product, ProductStatus } from "./entities/product.entity";
import { ProductPublishedMail } from "./product-published.mail";

@ObjectType()
class ValidationResponse {
    @Field()
    ok: boolean;

    @Field({ nullable: true })
    errorCode?: string;
}

@InputType()
export class ValidateProductInput {
    @IsString()
    @Field()
    title: string;
}

@Resolver(() => Product)
@RequiredPermission(["products"], { skipScopeCheck: true })
export class CustomProductResolver {
    constructor(
        private readonly entityManager: EntityManager,
        private readonly mailerService: MailerService,
        private readonly productPublishedMail: ProductPublishedMail,
    ) {}

    @Mutation(() => Boolean)
    async publishAllProducts(): Promise<boolean> {
        const countProductPublished = await this.entityManager.count(Product, { status: { $ne: ProductStatus.Published } });
        await this.entityManager.nativeUpdate(Product, { status: { $ne: ProductStatus.Published } }, { status: ProductStatus.Published });

        await this.mailerService.sendMail({
            ...(await this.productPublishedMail.generateMail({
                recipient: { name: "Product Manager", email: "product-manager@comet-dxp.com", language: "en" },
                countProductPublished: countProductPublished,
            })),
        });
        return true;
    }

    @Query(() => ValidationResponse)
    async validateProduct(@Args("input", { type: () => ValidateProductInput }) input: ValidateProductInput): Promise<ValidationResponse> {
        if (input.title.length < 3) {
            // in a real world scenario, this would be implemented as class-validator constraint + client side validation
            return { ok: false, errorCode: "TITLE_TOO_SHORT" };
        }
        return { ok: true };
    }
}
