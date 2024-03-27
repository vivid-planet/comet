export interface ContentGenerationServiceInterface {
    generateAltText?(fileUrl: string): Promise<string>;
    generateImageTitle?(fileUrl: string): Promise<string>;
}
