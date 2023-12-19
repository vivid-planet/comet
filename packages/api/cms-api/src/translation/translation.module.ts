import { DynamicModule, Global, Module } from "@nestjs/common";

import { TranslationServiceInterface } from "./translation.config";
import { TranslationResolver } from "./translation.resolver";
import { TRANSLATION_CONFIG } from "./translation-config.constants";

interface TranslationConfig {
    service: TranslationServiceInterface;
}

@Global()
@Module({})
export class TranslationModule {
    static register(config: TranslationConfig): DynamicModule {
        const translationConfigProvider = {
            provide: TRANSLATION_CONFIG,
            useValue: config,
        };

        return {
            module: TranslationModule,
            providers: [translationConfigProvider, TranslationResolver],
            exports: [translationConfigProvider],
        };
    }
}
