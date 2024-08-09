"use client";
import React from "react";

import { CookieApiHook } from "./CookieApiContext";

type WindowWithCookiebot = Window & {
    Cookiebot: {
        consent: Record<string, boolean>;
        renew: () => void;
        [key: string]: unknown;
    };
};

const isWindowWithCookiebot = (window: Window): window is WindowWithCookiebot => {
    return "Cookiebot" in window;
};

export const useCookieBotCookieApi: CookieApiHook = () => {
    const [consentedCookies, setConsentedCookies] = React.useState<string[]>([]);
    const [cookiePlatformLoaded, setCookiePlatformLoaded] = React.useState(false);

    React.useEffect(() => {
        const handleCookieUpdated = () => {
            if (isWindowWithCookiebot(window)) {
                setCookiePlatformLoaded(true);
                const consentedList = window.Cookiebot.consent;
                setConsentedCookies(Object.keys(consentedList).filter((key) => consentedList[key]));
            }
        };

        window.addEventListener("CookiebotOnConsentReady", handleCookieUpdated);

        return () => {
            window.removeEventListener("CookiebotOnConsentReady", handleCookieUpdated);
        };
    }, []);

    return {
        cookiePlatformLoaded,
        consentedCookies,
        openCookieSettings: () => {
            if (isWindowWithCookiebot(window)) {
                window.Cookiebot.renew();
            }
        },
    };
};
