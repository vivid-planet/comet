import { DynamicModule, Module, ValueProvider } from "@nestjs/common";

import { AzureAITranslatorConfig } from "./azure-ai-translator.config";
import { AZURE_AI_TRANSLATOR_CONFIG } from "./azure-ai-translator.constants";
import { AzureAITranslatorResolver } from "./azure-ai-translator.resolver";

@Module({})
export class AzureAITranslatorModule {
    static register(config: AzureAITranslatorConfig): DynamicModule {
        const configProvider: ValueProvider<AzureAITranslatorConfig> = {
            provide: AZURE_AI_TRANSLATOR_CONFIG,
            useValue: config,
        };

        return {
            module: AzureAITranslatorModule,
            providers: [configProvider, AzureAITranslatorResolver],
        };
    }
}
