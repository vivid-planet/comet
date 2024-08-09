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
    const [simulateLoadingCookieProvider, setSimulateLoadingCookieProvider] = React.useState(true);

    React.useEffect(() => {
        const storedCookies = window.localStorage.getItem(localStorageCookieApiKey);
        const cookiesList = JSON.parse(storedCookies ?? "[]");
        logCookieUpdate(cookiesList);

        const simulateLoadingTimeout = setTimeout(() => {
            setSimulateLoadingCookieProvider(false);
        }, 1000);

        return () => {
            clearTimeout(simulateLoadingTimeout);
        };
    }, []);

    const openCookieSettings = React.useCallback(() => {
        const cookies = prompt('Define consented cookies (separated by ","):', consentedCookies.join(",")) ?? "";
        const cookiesList = cookies.split(",").map((cookie) => cookie.trim());
        setConsentedCookies(cookiesList);
        logCookieUpdate(cookiesList);
    }, [consentedCookies, setConsentedCookies]);

    React.useEffect(() => {
        window.cometLocalStorageCookieApi = {
            cookieProviderLoaded: !simulateLoadingCookieProvider,
            consentedCookies,
            openCookieSettings: openCookieSettings,
        };
    }, [simulateLoadingCookieProvider, consentedCookies, openCookieSettings]);

    return {
        cookieProviderLoaded: !simulateLoadingCookieProvider,
        consentedCookies: simulateLoadingCookieProvider ? [] : consentedCookies,
        openCookieSettings,
    };
};

const logCookieUpdate = (cookies: string[]) => {
    // eslint-disable-next-line no-console
    console.info("Consented cookies updated:", cookies);
};
