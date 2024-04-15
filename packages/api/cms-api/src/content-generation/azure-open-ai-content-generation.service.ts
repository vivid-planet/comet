import { AzureKeyCredential, ChatRequestMessage, OpenAIClient } from "@azure/openai";
import { Injectable } from "@nestjs/common";

import { FilesService } from "../dam/files/files.service";

export type AzureOpenAiContentGenerationConfig = {
    deploymentId: string;
    apiKey: string;
    apiUrl: string;
};

@Injectable()
export class AzureOpenAiContentGenerationService {
    constructor(private readonly filesService: FilesService) {}

    async generateAltText(fileId: string, config: AzureOpenAiContentGenerationConfig): Promise<string> {
        const file = await this.filesService.findOneById(fileId);

        if (file === null) {
            throw new Error("File doesn't exist");
        }

        const client = new OpenAIClient(config.apiUrl, new AzureKeyCredential(config.apiKey));
        const prompt: ChatRequestMessage[] = [
            {
                role: "system",
                content:
                    "You are an alt text expert. The user will provide you with an image and your job is to provide a description of the image. This will help visually impaired users understand the content of the image. Keep yourself to a short description",
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

    async generateImageTitle(fileId: string, config: AzureOpenAiContentGenerationConfig): Promise<string> {
        const file = await this.filesService.findOneById(fileId);

        if (file === null) {
            throw new Error("File doesn't exist");
        }

        const client = new OpenAIClient(config.apiUrl, new AzureKeyCredential(config.apiKey));
        const prompt: ChatRequestMessage[] = [
            {
                role: "system",
                content:
                    "The user will provide you with an image. Your job is it two write a great short title for this image. Do not put the title inside quotation marks",
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
