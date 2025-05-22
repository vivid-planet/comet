"use client";

import { useEffect, useState } from "react";

import { type CookieApiHook } from "./CookieApiContext";

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
    const [consentedCookies, setConsentedCookies] = useState<string[]>([]);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const handleCookieUpdated = () => {
            if (isWindowWithCookiebot(window)) {
                setInitialized(true);
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
        initialized,
        consentedCookies,
        openCookieSettings: () => {
            if (isWindowWithCookiebot(window)) {
                window.Cookiebot.renew();
            }
        },
    };
};
