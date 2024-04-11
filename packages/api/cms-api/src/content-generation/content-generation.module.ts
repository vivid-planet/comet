import { DynamicModule, Global, Module, Type } from "@nestjs/common";

import { CONTENT_GENERATION_SERVICE } from "./content-generation.constants";
import { ContentGenerationServiceInterface } from "./content-generation-service.interface";
import { GenerateAltTextResolver } from "./generate-alt-text.resolver";
import { GenerateImageTitleResolver } from "./generate-image-title.resolver";
import { OpenAiContentGenerationService } from "./openai-content-generation.service";

export interface ContentGenerationModuleOptions {
    Service: Type<ContentGenerationServiceInterface>;
}

@Global()
@Module({})
export class ContentGenerationModule {
    static register({ Service }: ContentGenerationModuleOptions): DynamicModule {
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
                OpenAiContentGenerationService,
                ...providers,
            ],
        };
    }
}
