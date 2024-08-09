"use client";
import React from "react";
import { useLocalStorage } from "usehooks-ts";

import { CookieApi, CookieApiHook } from "./CookieApiContext";

const localStorageCookieApiKey = "comet-dev-cookie-api-consented-cookies";

declare global {
    interface Window {
        cometLocalStorageCookieApi: CookieApi;
    }
}

/**
 * Only for use in development environment.
 */
export const useLocalStorageCookieApi: CookieApiHook = () => {
    const [consentedCookies, setConsentedCookies] = useLocalStorage<string[]>(localStorageCookieApiKey, []);
    const [cookiePlatformLoaded, setCookiePlatformLoaded] = React.useState(false);

    const openCookieSettings = React.useCallback(() => {
        const cookies = prompt('Define consented cookies (separated by ","):', consentedCookies.join(",")) ?? "";
        const cookiesList = cookies.split(",").map((cookie) => cookie.trim());
        setConsentedCookies(cookiesList);
        logCookieUpdate(cookiesList);
    }, [consentedCookies, setConsentedCookies]);

    React.useEffect(() => {
        const storedCookies = window.localStorage.getItem(localStorageCookieApiKey);
        const cookiesList = JSON.parse(storedCookies ?? "[]");
        logCookieUpdate(cookiesList);

        const simulateLoadingTimeout = setTimeout(() => {
            setCookiePlatformLoaded(true);
            window.cometLocalStorageCookieApi = {
                cookiePlatformLoaded: true,
                consentedCookies,
                openCookieSettings: openCookieSettings,
            };
        }, 1000);

        return () => {
            clearTimeout(simulateLoadingTimeout);
        };
    }, [consentedCookies, openCookieSettings]);

    return {
        cookiePlatformLoaded,
        consentedCookies,
        openCookieSettings,
    };
};

const logCookieUpdate = (cookies: string[]) => {
    // eslint-disable-next-line no-console
    console.info("Consented cookies updated:", cookies);
};
