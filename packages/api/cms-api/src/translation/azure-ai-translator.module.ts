import { DynamicModule, Module, ValueProvider } from "@nestjs/common";

import { AzureAiTranslatorConfig } from "./azure-ai-translator.config.js";
import { AZURE_AI_TRANSLATOR_CONFIG } from "./azure-ai-translator.constants.js";
import { AzureAiTranslatorResolver } from "./azure-ai-translator.resolver.js";

@Module({})
export class AzureAiTranslatorModule {
    static register(config: AzureAiTranslatorConfig): DynamicModule {
        const configProvider: ValueProvider<AzureAiTranslatorConfig> = {
            provide: AZURE_AI_TRANSLATOR_CONFIG,
            useValue: config,
        };

        return {
            module: AzureAiTranslatorModule,
            providers: [configProvider, AzureAiTranslatorResolver],
        };
    }
}
