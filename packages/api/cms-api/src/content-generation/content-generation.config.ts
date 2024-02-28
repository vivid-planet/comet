import { ContentGenerationRequest, ModelType } from "./content-generation.types";

export interface ContentGenerationConfig {
    models: {
        [key in ModelType]?: (request: ContentGenerationRequest) => Promise<string>;
    };
}
