import { Injectable } from "@nestjs/common";

@Injectable()
export class TranslatorService {
    translate(input: { text: string; targetLanguage: string }) {
        const { text, targetLanguage } = input;
        return `Implement a function in the TranslatorService to translate to the target language: "${targetLanguage}". ${text}`;
    }
}
