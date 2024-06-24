import { DynamicModule, Global, Module, ModuleMetadata, Type } from "@nestjs/common";

import { AzureOpenAiContentGenerationService, AzureOpenAiContentGenerationServiceConfig } from "./azure-open-ai-content-generation.service";
import { AZURE_OPEN_AI_CONTENT_GENERATION_SERVICE_CONFIG, CONTENT_GENERATION_SERVICE } from "./content-generation.constants";
import { ContentGenerationServiceInterface } from "./content-generation-service.interface";
import { GenerateAltTextResolver } from "./generate-alt-text.resolver";
import { GenerateImageTitleResolver } from "./generate-image-title.resolver";

export interface ContentGenerationModuleOptions {
    Service: Type<ContentGenerationServiceInterface>;
    config: {
        openAiContentGeneration?: AzureOpenAiContentGenerationServiceConfig;
    };
    imports?: ModuleMetadata["imports"];
}

@Global()
@Module({})
export class ContentGenerationModule {
    static register({ Service, config, imports }: ContentGenerationModuleOptions): DynamicModule {
        const methods = Object.getOwnPropertyNames(Service.prototype);
        const providers = [];
        if (methods.includes("generateImageTitle")) {
            providers.push(GenerateImageTitleResolver);
        }
        if (methods.includes("generateAltText")) {
            providers.push(GenerateAltTextResolver);
        }

        return {
            module: ContentGenerationModule,
            providers: [
                {
                    provide: CONTENT_GENERATION_SERVICE,
                    useClass: Service,
                },
                {
                    provide: AZURE_OPEN_AI_CONTENT_GENERATION_SERVICE_CONFIG,
                    useValue: config.openAiContentGeneration,
                },
                AzureOpenAiContentGenerationService,
                ...providers,
            ],
            imports,
        };
    }
}
