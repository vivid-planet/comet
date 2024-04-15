import { AzureOpenAiContentGenerationConfig, AzureOpenAiContentGenerationService, ContentGenerationServiceInterface } from "@comet/cms-api";
import { Inject, Injectable } from "@nestjs/common";
import { Config } from "@src/config/config";
import { CONFIG } from "@src/config/config.module";

@Injectable()
export class ContentGenerationService implements ContentGenerationServiceInterface {
    azureOpenAiConfig: AzureOpenAiContentGenerationConfig;

    constructor(
        @Inject(CONFIG) private readonly config: Config,
        private readonly openAiContentGenerationService: AzureOpenAiContentGenerationService,
    ) {
        if (config.contentGeneration) {
            this.azureOpenAiConfig = config.contentGeneration;
        } else {
            throw new Error("Couldn't find contentGeneration config");
        }
    }

    async generateAltText(fileId: string) {
        return this.openAiContentGenerationService.generateAltText(fileId, this.azureOpenAiConfig);
    }

    async generateImageTitle(fileId: string) {
        return this.openAiContentGenerationService.generateAltText(fileId, this.azureOpenAiConfig);
    }
}
