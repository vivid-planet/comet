import { DynamicModule, Global, Module } from "@nestjs/common";

import { ContentGenerationConfig } from "./content-generation.config";
import { CONTENT_GENERATION_CONFIG } from "./content-generation.constants";
import { ContentGenerationResolver } from "./content-generation.resolver";
import { ContentGenerationService } from "./content-generation.service";

@Global()
@Module({})
export class ContentGenerationModule {
    static register(options: ContentGenerationConfig): DynamicModule {
        const contentGenerationConfigProvider = {
            provide: CONTENT_GENERATION_CONFIG,
            useValue: options,
        };

        return {
            module: ContentGenerationModule,
            providers: [contentGenerationConfigProvider, ContentGenerationService, ContentGenerationResolver],
        };
    }
}
