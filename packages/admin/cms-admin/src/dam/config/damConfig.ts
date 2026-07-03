import type { ReactNode } from "react";

import { useCometConfig } from "../../config/CometConfigContext";

export interface DamConfig {
    acceptedMimeTypes?: string[];
    scopeParts?: string[];
    enableLicenseFeature?: boolean;
    requireLicense?: boolean;
    additionalToolbarItems?: ReactNode;
    importSources?: Record<string, { label: ReactNode }>;
    contentGeneration?: {
        generateAltText?: boolean;
        generateImageTitle?: boolean;
    };
    uploadsMaxFileSize: number;
    allowedImageAspectRatios: string[];
    maxSrcResolution: number;
    basePath?: string;
    /**
     * Videos larger than this size (in MB) are considered too large to be delivered with good performance.
     * Because videos are currently not optimized before delivery, a warning is shown when such a video is
     * uploaded to the DAM, on the DAM file detail page, and in the `DamVideoBlock`.
     *
     * Set to `false` to disable the warning globally, e.g. once videos are optimized before delivery.
     *
     * @default 16
     */
    maxRecommendedVideoFileSize?: number | false;
}

const defaultMaxRecommendedVideoFileSize = 16;
const bytesPerMegabyte = 1024 * 1024;

export function useDamConfig(): DamConfig {
    const cometConfig = useCometConfig();

    if (!cometConfig.dam) {
        throw new Error("No DAM configuration found. Make sure to set `dam` in `CometConfigProvider`.");
    }

    return cometConfig.dam;
}

interface DamVideoFileSizeWarning {
    /**
     * Whether the warning is enabled globally.
     */
    enabled: boolean;
    /**
     * The file size (in MB) above which videos are considered too large.
     */
    maxRecommendedVideoFileSize: number;
    /**
     * Returns whether the given file is a video that exceeds the recommended file size and should therefore
     * show the warning. Returns `false` when the warning is disabled globally.
     */
    isVideoTooLarge: (file: { mimetype: string; size: number }) => boolean;
}

export function useDamVideoFileSizeWarning(): DamVideoFileSizeWarning {
    const damConfig = useDamConfig();
    const enabled = damConfig.maxRecommendedVideoFileSize !== false;
    const maxRecommendedVideoFileSize =
        typeof damConfig.maxRecommendedVideoFileSize === "number" ? damConfig.maxRecommendedVideoFileSize : defaultMaxRecommendedVideoFileSize;

    return {
        enabled,
        maxRecommendedVideoFileSize,
        isVideoTooLarge: (file) => enabled && file.mimetype.startsWith("video/") && file.size > maxRecommendedVideoFileSize * bytesPerMegabyte,
    };
}

export function useDamBasePath(): string {
    const damConfig = useDamConfig();

    return damConfig.basePath ?? "dam";
}
