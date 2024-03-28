import { AzureKeyCredential, ChatRequestMessage, OpenAIClient } from "@azure/openai";
import { Injectable } from "@nestjs/common";
import fetch from "node-fetch";

import { OpenAiContentGenerationConfig } from "./content-generation.config";
import { ContentGenerationServiceInterface } from "./content-generation.service.interface";

@Injectable()
export class OpenAiContentGenerationService implements ContentGenerationServiceInterface {
    constructor(private readonly config: OpenAiContentGenerationConfig<ContentGenerationServiceInterface>) {}

    async generateAltText(fileUrl: string): Promise<string> {
        if (!this.config.generateAltText) {
            throw new Error("Model not defined");
        }

        const client = new OpenAIClient(this.config.generateAltText.apiUrl, new AzureKeyCredential(this.config.generateAltText.apiKey));
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
        const result = await client.getChatCompletions(this.config.generateAltText.deploymentId, prompt, { maxTokens: 300 });
        return result.choices[0].message?.content ?? "";
    }

    async generateImageTitle(fileUrl: string): Promise<string> {
        if (typeof this.config.generateImageTitle === "undefined") {
            throw new Error("Model not defined");
        }

        const client = new OpenAIClient(this.config.generateImageTitle.apiUrl, new AzureKeyCredential(this.config.generateImageTitle.apiKey));

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
        const result = await client.getChatCompletions(this.config.generateImageTitle.deploymentId, prompt, { maxTokens: 300 });
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
