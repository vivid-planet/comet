export interface Options {
    seed?: number;
    temperature?: number;
    maxTokens?: number;
}

export type ModelType = "text" | "textAdvanced" | "image" | "imageAdvanced";

export interface MlRequest {
    prompt?: string;
    instructions?: string;
    context?: string;
    examples?: Example[];
    options?: Options;
    image?: Image;
}

export interface MlResponse {
    response: string;
    image?: string;
}

export interface Example {
    role: "user" | "assistant";
    text: string;
}

export interface Image {
    base64: string;
}
