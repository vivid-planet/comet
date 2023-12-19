import { Inject } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";

import { TranslationConfig } from "./translation.config";
import { TRANSLATION_CONFIG } from "./translation-config.constants";

@Resolver(() => String)
export class TranslationResolver {
    constructor(@Inject(TRANSLATION_CONFIG) private readonly config: TranslationConfig) {}

    @Query(() => String)
    async translate(
        @Args("value", { type: () => String }) value: string,
        @Args("language", { type: () => String }) language: string,
    ): Promise<string> {
        return this.config.service.translate(value, language);
    }
}
