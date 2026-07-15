import type { AiContentType } from "./AiContentDisclosure";

const mediaNoun = { image: "image", video: "video" } as const;

/**
 * Composes the accessible name for an AI-disclosed media element.
 *
 * The AI disclosure is merged into the media element's accessible name (leading), so screen-reader
 * users learn which asset is AI-generated at first exposure (EU Article 50 AI Act). When the asset
 * is not marked as AI content, the plain description (alt text) is returned unchanged.
 *
 * The prefix is in English (matching the wording baked into the official EU labels). Pass an already
 * localized `description` (e.g. the DAM alt text in the content language) for the descriptive part.
 */
export function getAiContentAltText({
    aiContentType,
    mediaType,
    description,
}: {
    aiContentType?: AiContentType | null;
    mediaType: "image" | "video";
    description?: string | null;
}): string {
    if (!aiContentType) {
        return description ?? "";
    }

    const prefix = aiContentType === "Generated" ? `AI-generated ${mediaNoun[mediaType]}` : `AI-modified ${mediaNoun[mediaType]}`;

    return description ? `${prefix} – ${description}` : prefix;
}
