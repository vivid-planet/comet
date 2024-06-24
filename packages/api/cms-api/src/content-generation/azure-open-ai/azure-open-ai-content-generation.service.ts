import { AzureKeyCredential, ChatRequestMessage, OpenAIClient } from "@azure/openai";
import { Inject, Injectable } from "@nestjs/common";

import { FilesService } from "../../dam/files/files.service";
import { ContentGenerationServiceInterface } from "../content-generation-service.interface";
import { AZURE_OPEN_AI_CONTENT_GENERATION_SERVICE_CONFIG } from "./azure-open-ai.constants";

export type AzureOpenAiContentGenerationServiceConfig = AzureOpenAiConfig | ConfigByMethod;

export type AzureOpenAiConfig = {
    deploymentId: string;
    apiKey: string;
    apiUrl: string;
};

type ConfigByMethod = Partial<Record<ServiceMethods, AzureOpenAiConfig>>;

type ServiceMethods = Extract<keyof AzureOpenAiContentGenerationService, keyof ContentGenerationServiceInterface>;

function isAzureOpenAiContentGenerationConfig(config: AzureOpenAiContentGenerationServiceConfig): config is AzureOpenAiConfig {
    return "apiKey" in config;
}

@Injectable()
export class AzureOpenAiContentGenerationService {
    private readonly config: AzureOpenAiContentGenerationServiceConfig;

    constructor(
        private readonly filesService: FilesService,
        @Inject(AZURE_OPEN_AI_CONTENT_GENERATION_SERVICE_CONFIG) injectedConfig?: AzureOpenAiContentGenerationServiceConfig,
    ) {
        if (!injectedConfig) {
            throw new Error("No config provided");
        }

        this.config = injectedConfig;
    }

    private getConfigForMethod(name: ServiceMethods): AzureOpenAiConfig {
        if (isAzureOpenAiContentGenerationConfig(this.config)) {
            return this.config;
        }

        const config = this.config[name];
        if (!config) {
            throw new Error(`Missing config for method ${name}`);
        }
        return config;
    }

    async generateAltText(fileId: string): Promise<string> {
        const config = this.getConfigForMethod("generateAltText");

        const file = await this.filesService.findOneById(fileId);

        if (file === null) {
            throw new Error("File doesn't exist");
        }

        const client = new OpenAIClient(config.apiUrl, new AzureKeyCredential(config.apiKey));
        const prompt: ChatRequestMessage[] = [
            {
                role: "system",
                content:
                    "You are an expert in writing alternative text for HTML images. The user will provide you with an image and your job is to provide an alternative text for this image. This text should help visually impaired users understand the content of the image. Keep yourself to a short description, ideally 3 sentences or less. Don't put the text in quotation marks.",
            },
            {
                role: "user",
                content: [
                    {
                        type: "image_url",
                        imageUrl: {
                            url: await this.filesService.getFileAsBase64String(file),
                            detail: "low",
                        },
                    },
                ],
            },
        ];
        const result = await client.getChatCompletions(config.deploymentId, prompt, { maxTokens: 300 });
        return result.choices[0].message?.content ?? "";
    }

    async generateImageTitle(fileId: string): Promise<string> {
        const config = this.getConfigForMethod("generateImageTitle");

        const file = await this.filesService.findOneById(fileId);

        if (file === null) {
            throw new Error("File doesn't exist");
        }

        const client = new OpenAIClient(config.apiUrl, new AzureKeyCredential(config.apiKey));
        const prompt: ChatRequestMessage[] = [
            {
                role: "system",
                content:
                    "The user will provide you with an image. Write a short text that can be displayed in the HTML title attribute of this image. Do not put the title inside quotation marks",
            },
            {
                role: "user",
                content: [
                    {
                        type: "image_url",
                        imageUrl: {
                            url: await this.filesService.getFileAsBase64String(file),
                            detail: "low",
                        },
                    },
                ],
            },
        ];
        const result = await client.getChatCompletions(config.deploymentId, prompt, { maxTokens: 300 });
        return result.choices[0].message?.content ?? "";
    }
}
