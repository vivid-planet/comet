export enum DEVICE_TYPE {
    MOBILE = "mobile",
    DESKTOP = "desktop",
}

export function useCurrentDeviceType() {
    const mobileUserAgentRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

    return mobileUserAgentRegex.test(navigator.userAgent) ? DEVICE_TYPE.MOBILE : DEVICE_TYPE.DESKTOP;
}
