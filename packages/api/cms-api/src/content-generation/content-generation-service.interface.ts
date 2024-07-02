export interface ContentGenerationServiceInterface {
    generateAltText?(fileId: string): Promise<string>;
    generateImageTitle?(fileId: string): Promise<string>;
}
