import { Inject, Injectable } from "@nestjs/common";
import fetch from "node-fetch";

import { ContentGenerationConfig } from "./content-generation.config";
import { CONTENT_GENERATION_CONFIG } from "./content-generation.constants";

async function loadImageAsBase64(url: string) {
    const response = await fetch(url);
    const buffer = await response.buffer();
    const base64String = buffer.toString("base64");
    const mimeType = response.headers.get("content-type");
    return `data:${mimeType};base64,${base64String}`;
}

@Injectable()
export class ContentGenerationService {
    constructor(@Inject(CONTENT_GENERATION_CONFIG) private readonly config: ContentGenerationConfig) {}

    async generateAltText(imageUrl: string): Promise<string> {
        if (!this.config.models.image) return "Model not defined";
        return this.config.models.image({
            instructions:
                "You are an alt text expert. The user will provide you with an image and your job is to provide a description of the image. This will help visually impaired users understand the content of the image. Keep yourself to a short description",
            image: {
                base64: await loadImageAsBase64(imageUrl),
            },
            options: {
                maxTokens: 300,
            },
        });
    }

    async generateImageTitle(imageUrl: string): Promise<string> {
        if (!this.config.models.image) return "Model not defined";
        return this.config.models.image({
            instructions:
                "The user will provide you with an image. Your job is it two write a great short title for this image. Do not put the title inside quotation marks",
            image: {
                base64: await loadImageAsBase64(imageUrl),
            },
        });
    }
}
