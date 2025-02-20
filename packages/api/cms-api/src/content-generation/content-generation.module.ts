import { DynamicModule, Global, Module, ModuleMetadata, Type } from "@nestjs/common";

import { CONTENT_GENERATION_SERVICE } from "./content-generation.constants";
import { ContentGenerationServiceInterface } from "./content-generation-service.interface";
import { GenerateAltTextResolver } from "./generate-alt-text.resolver";
import { GenerateImageTitleResolver } from "./generate-image-title.resolver";
import { GenerateSeoTagsResolver } from "./generate-seo-tags.resolver";

interface ContentGenerationModuleOptions {
    Service: Type<ContentGenerationServiceInterface>;
    imports?: ModuleMetadata["imports"];
}

@Global()
@Module({})
export class ContentGenerationModule {
    static register({ Service, imports }: ContentGenerationModuleOptions): DynamicModule {
        const methods = Object.getOwnPropertyNames(Service.prototype);
        const providers = [];
        if (methods.includes("generateImageTitle")) {
            providers.push(GenerateImageTitleResolver);
        }
        if (methods.includes("generateAltText")) {
            providers.push(GenerateAltTextResolver);
        }
        if (methods.includes("generateSeoTags")) {
            providers.push(GenerateSeoTagsResolver);
        }

        return {
            module: ContentGenerationModule,
            providers: [
                {
                    provide: CONTENT_GENERATION_SERVICE,
                    useClass: Service,
                },
                ...providers,
            ],
            imports,
        };
    }
}
