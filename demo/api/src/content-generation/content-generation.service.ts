import { CONTENT_GENERATION_CONFIG, OpenAiContentGenerationConfig, OpenAiContentGenerationService } from "@comet/cms-api";
import { Inject, Injectable } from "@nestjs/common";
import { ContentGenerationServiceInterface } from "@src/../../../packages/api/cms-api/src/content-generation/content-generation-service.interface";

@Injectable()
export class ContentGenerationService implements ContentGenerationServiceInterface {
    constructor(
        @Inject(CONTENT_GENERATION_CONFIG) config: OpenAiContentGenerationConfig<ContentGenerationServiceInterface>,
        private readonly openAiContentGenerationService: OpenAiContentGenerationService,
    ) {
        this.openAiContentGenerationService.init(config);
    }

    async generateAltText(fileUrl: string) {
        return this.openAiContentGenerationService.generateAltText(fileUrl);
    }

    async generateImageTitle(fileUrl: string) {
        return this.openAiContentGenerationService.generateAltText(fileUrl);
    }
}
