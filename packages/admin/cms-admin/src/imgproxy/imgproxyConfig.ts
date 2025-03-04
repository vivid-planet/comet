import { useCometConfig } from "../config/CometConfigContext";

export interface ImgproxyConfig {
    maxSrcResolution: number;
    quality: number;
}

export function useImgproxyConfig(): ImgproxyConfig {
    const cometConfig = useCometConfig();

    if (!cometConfig.imgproxy) {
        throw new Error("No imgproxy configuration found. Make sure to set `imgproxy` in `CometConfigProvider`.");
    }

    return cometConfig.imgproxy;
}
