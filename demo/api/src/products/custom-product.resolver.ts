import { RequiredPermission } from "@comet/cms-api";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Mutation, Query, Resolver } from "@nestjs/graphql";
import { TranslationService } from "@src/config/translation.service";

import { Product, ProductStatus } from "./entities/product.entity";

@Resolver(() => Product)
@RequiredPermission(["products"], { skipScopeCheck: true })
export class CustomProductResolver {
    constructor(
        @InjectRepository(Product) private readonly repository: EntityRepository<Product>,
        private readonly translationService: TranslationService,
    ) {}

    @Mutation(() => Boolean)
    async publishAllProducts(): Promise<boolean> {
        await this.repository.nativeUpdate({ status: { $ne: ProductStatus.Published } }, { status: ProductStatus.Published });
        return true;
    }

    @Query(() => String)
    async myTranslatedString(): Promise<string> {
        const language = "de"; // TODO get the language from anywhere, e.g. from the request context, scope or database

        return this.translationService.getIntl(language).formatMessage({
            id: "my-translated-string",
            defaultMessage: "Lorem ipsum",
        });
    }
}
