export type OpenAiContentGenerationConfig<T> = {
    [K in keyof T]: {
        deploymentId: string;
        apiKey: string;
        apiUrl: string;
    };
};
