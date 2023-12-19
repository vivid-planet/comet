export interface TranslationServiceInterface {
    translate(value: string, language: string): Promise<string>;
}

export interface TranslationConfig {
    service: TranslationServiceInterface;
}
