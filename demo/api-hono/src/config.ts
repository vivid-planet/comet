import type { DamConfig, ImgproxyConfig } from "@dextinity/cms-hono";
import { z } from "zod";

const environmentVariables = z.object({
    DAM_SECRET: z.string().min(16),
    IMGPROXY_URL: z.url(),
    IMGPROXY_KEY: z.string().regex(/^[0-9a-f]+$/),
    IMGPROXY_SALT: z.string().regex(/^[0-9a-f]+$/),
    BLOB_STORAGE_DIRECTORY_PREFIX: z.string().min(1),
    API_HONO_TOKEN: z.string().min(32),
    API_HONO_PUBLIC_URL: z.url().optional(),
});

const imageSizes = [16, 32, 48, 64, 96, 128, 256, 320, 384];
const deviceSizes = [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3200, 3840];

export type Config = ReturnType<typeof createConfig>;

/** Takes the environment as an argument because Cloudflare Workers pass it with each request instead of `process.env`. */
export function createConfig(environment: Record<string, unknown>) {
    const variables = environmentVariables.parse(environment);

    return {
        apiToken: variables.API_HONO_TOKEN,
        imgproxy: {
            url: variables.IMGPROXY_URL,
            key: variables.IMGPROXY_KEY,
            salt: variables.IMGPROXY_SALT,
            quality: 80,
        } satisfies ImgproxyConfig,
        dam: {
            secret: variables.DAM_SECRET,
            allowedImageSizes: [...imageSizes, ...deviceSizes],
            allowedAspectRatios: ["16x9", "4x3", "3x2", "3x1", "2x1", "1x1", "1x2", "1x3", "2x3", "3x4", "9x16", "1200x630"],
            filesDirectory: `${variables.BLOB_STORAGE_DIRECTORY_PREFIX}-files`,
            maxFileSize: 500,
            maxSrcResolution: 70,
            includeFormatExtensionInImageUrls: true,
            publicApiUrl: variables.API_HONO_PUBLIC_URL,
        } satisfies DamConfig,
    };
}
