type GeneratorConfigImport = {
    name: string;
    import: string;
};
/**
 * Type Guard used by generator runtime for places where runtime vs. configtime types mismatch
 */
export function isGeneratorConfigImport(value: unknown): value is GeneratorConfigImport {
    if (value && typeof value === "object" && "import" in value && "name" in value) {
        return true;
    }
    return false;
}

type GeneratorConfigCode = {
    code: string;
    imports: {
        name: string;
        import: string;
    }[];
};
/**
 * Type Guard used by generator runtime for places where runtime vs. configtime types mismatch
 */
export function isGeneratorConfigCode(value: unknown): value is GeneratorConfigCode {
    if (value && typeof value === "object" && "code" in value && "imports" in value) {
        return true;
    }
    return false;
}

type GeneratorConfigFormattedMessage = {
    formattedMessageId: string;
    defaultMessage: string;
};
/**
 * Type Guard used by generator runtime for places where runtime vs. configtime types mismatch
 */
export function isGeneratorConfigFormattedMessage(value: unknown): value is GeneratorConfigFormattedMessage {
    if (value && typeof value === "object" && "formattedMessageId" in value) {
        return true;
    }
    return false;
}
