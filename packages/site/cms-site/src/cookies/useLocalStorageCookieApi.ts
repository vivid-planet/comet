"use client";
import { useCallback, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

import { type CookieApi, type CookieApiHook } from "./CookieApiContext";

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
    const [initialized, setInitialized] = useState(false);

    const openCookieSettings = useCallback(() => {
        const cookies = prompt('Define consented cookies (separated by ","):', consentedCookies.join(",")) ?? "";
        const cookiesList = cookies.split(",").map((cookie) => cookie.trim());
        setConsentedCookies(cookiesList);
        logCookieUpdate(cookiesList);
    }, [consentedCookies, setConsentedCookies]);

    useEffect(() => {
        const storedCookies = window.localStorage.getItem(localStorageCookieApiKey);
        const cookiesList = JSON.parse(storedCookies ?? "[]");
        logCookieUpdate(cookiesList);

        const simulateLoadingTimeout = setTimeout(() => {
            setInitialized(true);
            window.cometLocalStorageCookieApi = {
                initialized: true,
                consentedCookies,
                openCookieSettings: openCookieSettings,
            };
        }, 1000);

        return () => {
            clearTimeout(simulateLoadingTimeout);
        };
    }, [consentedCookies, openCookieSettings]);

    return {
        initialized,
        consentedCookies,
        openCookieSettings,
    };
};

const logCookieUpdate = (cookies: string[]) => {
    // eslint-disable-next-line no-console
    console.info("Consented cookies updated:", cookies);
};
