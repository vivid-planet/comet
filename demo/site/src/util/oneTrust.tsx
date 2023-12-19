import React from "react";

type OneTrustOnConsentChangedEvent = {
    detail: string[];
    [key: string]: unknown;
};

type OnConsentChangedCallback = (event: OneTrustOnConsentChangedEvent) => void;

type WindowWithOneTrust = Window & {
    OneTrust: {
        ToggleInfoDisplay: () => void;
        OnConsentChanged: (callback: OnConsentChangedCallback) => void;
        [key: string]: unknown;
    };
};

export const isWindowWithOneTrust = (window: Window): window is WindowWithOneTrust => {
    return "OneTrust" in window;
};

export const openOneTrustCookieSettings = () => {
    if (isWindowWithOneTrust(window)) {
        window.OneTrust.ToggleInfoDisplay();
    }
};

export const useOneTrustConsent = () => {
    const [consentedCookies, setConsentedCookies] = React.useState<string[]>([]);

    React.useEffect(() => {
        if (isWindowWithOneTrust(window)) {
            window.OneTrust.OnConsentChanged((event) => {
                setConsentedCookies(event.detail);
            });
        }
    }, []);

    return consentedCookies;
};
