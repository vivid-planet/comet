import { RequiredPermission } from "@comet/cms-api";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Mutation, Query, Resolver } from "@nestjs/graphql";
import { getMessages } from "@src/common/lang";
import { createIntl, createIntlCache, IntlCache } from "react-intl";

import { Product, ProductStatus } from "./entities/product.entity";

@Resolver(() => Product)
@RequiredPermission(["products"], { skipScopeCheck: true })
export class CustomProductResolver {
    private readonly intlCache: IntlCache;
    constructor(@InjectRepository(Product) private readonly repository: EntityRepository<Product>) {
        this.intlCache = createIntlCache();
    }

    @Mutation(() => Boolean)
    async publishAllProducts(): Promise<boolean> {
        await this.repository.nativeUpdate({ status: { $ne: ProductStatus.Published } }, { status: ProductStatus.Published });
        return true;
    }

    @Query(() => String)
    async myTranslatedString(): Promise<string> {
        const language = "de"; // TODO correctly set the language, maybe move into the mail template
        const messages = getMessages(language);

        const intl = createIntl(
            {
                // Locale of the application
                locale: language,
                // Locale of the fallback defaultMessage
                defaultLocale: language,
                messages: messages,
            },
            this.intlCache,
        );

        return intl.formatMessage({
            id: "my-translated-string",
            defaultMessage: "Lorem ipsum",
        });
    }
}
