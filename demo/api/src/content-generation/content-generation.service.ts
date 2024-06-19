import { AzureOpenAiContentGenerationService, ContentGenerationServiceInterface } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ContentGenerationService implements ContentGenerationServiceInterface {
    constructor(private readonly openAiContentGenerationService: AzureOpenAiContentGenerationService) {}

    async generateAltText(fileId: string) {
        return this.openAiContentGenerationService.generateAltText(fileId);
    }

    async generateImageTitle(fileId: string) {
        return this.openAiContentGenerationService.generateImageTitle(fileId);
    }
}
