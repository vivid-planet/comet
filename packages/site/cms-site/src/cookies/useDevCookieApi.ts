import React from "react";
import { useLocalStorage } from "usehooks-ts";

import { CookieApiHook } from "./CookieApiHook";

const localStorageCookieApiKey = "comet-dev-cookie-api-consented-cookies";

/**
 * Only for use in development environment.
 */
export const useDevCookieApi: CookieApiHook = (): ReturnType<CookieApiHook> => {
    const [consentedCookies, setConsentedCookies] = useLocalStorage<string[]>(localStorageCookieApiKey, []);

    React.useEffect(() => {
        const storedCookies = window.localStorage.getItem(localStorageCookieApiKey);
        const cookiesList = JSON.parse(storedCookies ?? "[]");
        logCookieUpdate(cookiesList);
    }, []);

    const openCookieSettings = React.useCallback(() => {
        const cookies = prompt('Define consented cookies (separated by ","):', consentedCookies.join(",")) ?? "";
        const cookiesList = cookies.split(",").map((cookie) => cookie.trim());
        setConsentedCookies(cookiesList);
        logCookieUpdate(cookiesList);
    }, [consentedCookies, setConsentedCookies]);

    React.useEffect(() => {
        // @ts-expect-error TODO: Can this be fixed?
        window["cometDevCookieApi"] = {
            consentedCookies,
            openCookieSettings: openCookieSettings,
        };
    }, [consentedCookies, openCookieSettings]);

    return {
        consentedCookies,
        openCookieSettings,
    };
};

const logCookieUpdate = (cookies: string[]) => {
    // eslint-disable-next-line no-console
    console.info("Consented cookies updated:", cookies);
};
