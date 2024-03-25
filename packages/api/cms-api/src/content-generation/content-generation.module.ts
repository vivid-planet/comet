import { DynamicModule, Global, Module } from "@nestjs/common";

import { CONTENT_GENERATION_SERVICE } from "./content-generation.constants";
import { ContentGenerationServiceInterface } from "./content-generation.service.interface";
import { GenerateAltTextResolver } from "./generate-alt-text.resolver";
import { GenerateImageTitleResolver } from "./generate-image-title.resolver";

@Global()
@Module({})
export class ContentGenerationModule {
    static register(service: ContentGenerationServiceInterface): DynamicModule {
        const providers = [];
        if (service.generateImageTitle) {
            providers.push(GenerateImageTitleResolver);
        }
        if (service.generateAltText) {
            providers.push(GenerateAltTextResolver);
        }

        return {
            module: ContentGenerationModule,
            providers: [
                {
                    provide: CONTENT_GENERATION_SERVICE,
                    useValue: service,
                },
                ...providers,
            ],
        };
    }
}
