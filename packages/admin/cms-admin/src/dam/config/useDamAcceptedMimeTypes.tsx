import { damDefaultAcceptedMimeTypes } from "./damDefaultAcceptedMimeTypes";
import { useDamConfig } from "./useDamConfig";

const isSvgImage = (mimeType: string): boolean => {
    return mimeType === "image/svg+xml";
};

const isPixelImage = (mimeType: string): boolean => {
    return mimeType.startsWith("image/") && !isSvgImage(mimeType);
};

const isAudio = (mimeType: string): boolean => {
    return mimeType.startsWith("audio/");
};

const isVideo = (mimeType: string): boolean => {
    return mimeType.startsWith("video/");
};

const isDocument = (mimeType: string): boolean => {
    return !isSvgImage(mimeType) && !isPixelImage(mimeType) && !isAudio(mimeType) && !isVideo(mimeType);
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
    };
}

export const useDamAcceptedMimeTypes = (): UseDamAcceptedMimeTypesApi => {
    const damConfig = useDamConfig();
    const allAcceptedMimeTypes = damConfig.overrideAcceptedMimeTypes ?? [...damDefaultAcceptedMimeTypes, ...(damConfig.additionalMimeTypes ?? [])];

    return {
        allAcceptedMimeTypes,
        filteredAcceptedMimeTypes: {
            svgImage: ["image/svg+xml"],
            pixelImage: allAcceptedMimeTypes.filter(isPixelImage),
            audio: allAcceptedMimeTypes.filter(isAudio),
            video: allAcceptedMimeTypes.filter(isVideo),
            document: allAcceptedMimeTypes.filter(isDocument),
            pdf: ["application/pdf"],
        },
    };
};
