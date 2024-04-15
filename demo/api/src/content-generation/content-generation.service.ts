import { ContentGenerationServiceInterface, OpenAiContentGenerationConfig, OpenAiContentGenerationService } from "@comet/cms-api";
import { Inject, Injectable } from "@nestjs/common";
import { Config } from "@src/config/config";
import { CONFIG } from "@src/config/config.module";

@Injectable()
export class ContentGenerationService implements ContentGenerationServiceInterface {
    openAiContentGenerationServiceConfig: OpenAiContentGenerationConfig;

    constructor(@Inject(CONFIG) private readonly config: Config, private readonly openAiContentGenerationService: OpenAiContentGenerationService) {
        if (config.contentGeneration) {
            this.openAiContentGenerationServiceConfig = config.contentGeneration;
        } else {
            throw new Error("Found invalid contentGeneration config");
        }
    }

    async generateAltText(fileUrl: string) {
        return this.openAiContentGenerationService.generateAltText(fileUrl, this.openAiContentGenerationServiceConfig);
    }

    async generateImageTitle(fileUrl: string) {
        return this.openAiContentGenerationService.generateAltText(fileUrl, this.openAiContentGenerationServiceConfig);
    }
}
