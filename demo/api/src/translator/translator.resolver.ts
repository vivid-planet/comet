import { RequiredPermission } from "@comet/cms-api";
import { Args, Query, Resolver } from "@nestjs/graphql";

import { TranslatorInput } from "./dto/translator.input";
import { TranslatorService } from "./translator.service";

@Resolver(() => TranslatorResolver)
@RequiredPermission(["translation"], { skipScopeCheck: true })
export class TranslatorResolver {
    constructor(private readonly translatorService: TranslatorService) {}

    @Query(() => String)
    async translate(@Args("input") input: TranslatorInput): Promise<string> {
        return this.translatorService.translate(input);
    }
}
