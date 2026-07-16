import type { AiContentType } from "./AiContentDisclosure";

/** Prefixes prepended to the accessible name, keyed by AI content type. Override to localize. */
export interface AiContentAltTextLabels {
    generated: string;
    modified: string;
}

/**
 * Composes the accessible name for an AI-disclosed media element.
 *
 * The AI disclosure is merged into the media element's accessible name (leading), so screen-reader
 * users learn which asset is AI-generated at first exposure (EU Article 50 AI Act). When the asset
 * is not marked as AI content, the plain description (alt text) is returned unchanged.
 *
 * The prefixes default to English (matching the wording baked into the official EU labels). Pass
 * `labels` to localize them, and an already localized `description` (e.g. the DAM alt text in the
 * content language) for the descriptive part.
 */
export function getAiContentAltText({
    aiContentType,
    description,
    labels,
}: {
    aiContentType?: AiContentType | null;
    description?: string | null;
    labels?: Partial<AiContentAltTextLabels>;
}): string {
    if (!aiContentType) {
        return description ?? "";
    }

    const { generated = "[AI-generated]", modified = "[AI-modified]" } = labels ?? {};
    const prefix = aiContentType === "Generated" ? generated : modified;

    return description ? `${prefix} – ${description}` : prefix;
}
