import { AzureKeyCredential, ChatRequestMessage, OpenAIClient } from "@azure/openai";
import { Injectable } from "@nestjs/common";
import fetch from "node-fetch";

export type OpenAiContentGenerationConfig = {
    deploymentId: string;
    apiKey: string;
    apiUrl: string;
};

@Injectable()
export class OpenAiContentGenerationService {
    async generateAltText(fileUrl: string, config: OpenAiContentGenerationConfig): Promise<string> {
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
                            url: await this.loadImageAsBase64(fileUrl),
                            detail: "low",
                        },
                    },
                ],
            },
        ];
        const result = await client.getChatCompletions(config.deploymentId, prompt, { maxTokens: 300 });
        return result.choices[0].message?.content ?? "";
    }

    async generateImageTitle(fileUrl: string, config: OpenAiContentGenerationConfig): Promise<string> {
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
                            url: await this.loadImageAsBase64(fileUrl),
                            detail: "low",
                        },
                    },
                ],
            },
        ];
        const result = await client.getChatCompletions(config.deploymentId, prompt, { maxTokens: 300 });
        return result.choices[0].message?.content ?? "";
    }

    private async loadImageAsBase64(url: string) {
        const response = await fetch(url);
        const buffer = await response.buffer();
        const base64String = buffer.toString("base64");
        const mimeType = response.headers.get("content-type");
        return `data:${mimeType};base64,${base64String}`;
    }
}
