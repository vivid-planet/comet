// This categorization is duplicated in admin/cms-admin/src/dam/config/useDamAcceptedMimeTypes.tsx
// If you change the categories here, change the admin file too.

export type MimetypeCategory = "svgImage" | "pixelImage" | "audio" | "video" | "document";

export function getMimetypeCategory(mimetype: string): MimetypeCategory {
    if (mimetype === "image/svg+xml") {
        return "svgImage";
    }
    if (mimetype.startsWith("image/")) {
        return "pixelImage";
    }
    if (mimetype.startsWith("audio/")) {
        return "audio";
    }
    if (mimetype.startsWith("video/")) {
        return "video";
    }
    return "document";
}

export function mimetypesHaveSameCategory(mimetypeA: string, mimetypeB: string): boolean {
    return getMimetypeCategory(mimetypeA) === getMimetypeCategory(mimetypeB);
}
