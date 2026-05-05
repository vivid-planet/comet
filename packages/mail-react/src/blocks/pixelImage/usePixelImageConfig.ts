import { type PixelImageConfig, useConfig } from "../../config/ConfigProvider.js";

/**
 * Reads `config.pixelImage` from the configuration context and returns it narrowed to non-null.
 */
export function usePixelImageConfig(): PixelImageConfig {
    const { pixelImage } = useConfig();

    if (!pixelImage) {
        throw new Error("`pixelImage` must be set in `config` on `MjmlMailRoot` or `ConfigProvider` to use the pixel-image configuration.");
    }

    return pixelImage;
}
