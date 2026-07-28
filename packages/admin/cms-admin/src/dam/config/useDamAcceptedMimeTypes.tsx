import { useDamConfig } from "./damConfig";
import { damDefaultAcceptedMimeTypes } from "./damDefaultAcceptedMimeTypes";

// This categorization is duplicated in api/cms-api/src/dam/common/mimeTypes/mimetype-category.ts
// If you change the categories here, change the api file too.

export type DamFileCategory = "svgImage" | "pixelImage" | "audio" | "video" | "document";

export const isSvgImage = (mimeType: string): boolean => {
    return mimeType === "image/svg+xml";
};

export const isPixelImage = (mimeType: string): boolean => {
    return mimeType.startsWith("image/") && !isSvgImage(mimeType);
};

export const isAudio = (mimeType: string): boolean => {
    return mimeType.startsWith("audio/");
};

export const isVideo = (mimeType: string): boolean => {
    return mimeType.startsWith("video/");
};

export const isDocument = (mimeType: string): boolean => {
    return !isSvgImage(mimeType) && !isPixelImage(mimeType) && !isAudio(mimeType) && !isVideo(mimeType);
};

export const getDamFileCategory = (mimeType: string): DamFileCategory => {
    if (isSvgImage(mimeType)) {
        return "svgImage";
    }
    if (isPixelImage(mimeType)) {
        return "pixelImage";
    }
    if (isAudio(mimeType)) {
        return "audio";
    }
    if (isVideo(mimeType)) {
        return "video";
    }
    return "document";
};

interface UseDamAcceptedMimeTypesApi {
    allAcceptedMimeTypes: string[];
    filteredAcceptedMimeTypes: {
        svgImage: string[];
        pixelImage: string[];
        audio: string[];
        video: string[];
        document: string[];
        pdf: string[];
        captions: string[];
    };
}

export const useDamAcceptedMimeTypes = (): UseDamAcceptedMimeTypesApi => {
    const damConfig = useDamConfig();
    const allAcceptedMimeTypes = damConfig.acceptedMimeTypes ?? damDefaultAcceptedMimeTypes;

    return {
        allAcceptedMimeTypes,
        filteredAcceptedMimeTypes: {
            svgImage: allAcceptedMimeTypes.filter(isSvgImage),
            pixelImage: allAcceptedMimeTypes.filter(isPixelImage),
            audio: allAcceptedMimeTypes.filter(isAudio),
            video: allAcceptedMimeTypes.filter(isVideo),
            document: allAcceptedMimeTypes.filter(isDocument),
            pdf: allAcceptedMimeTypes.filter((mimetype) => mimetype === "application/pdf"),
            captions: allAcceptedMimeTypes.filter((mimetype) => mimetype === "text/vtt"),
        },
    };
};
