import React from "react";
import { useLocalStorage } from "usehooks-ts";

import { CookieApi } from "./CookieApi";

const localStorageCookieApiKey = "comet-dev-cookie-api-consented-cookies";

/**
 * Only for use in development environment.
 */
export const useLocalStorageCookieApi: CookieApi = (): ReturnType<CookieApi> => {
    const [consentedCookies, setConsentedCookies] = useLocalStorage<string[]>(localStorageCookieApiKey, []);
    const [simulateLoadingCookieProvider, setSimulateLoadingCookieProvider] = React.useState(true);

    React.useEffect(() => {
        const storedCookies = window.localStorage.getItem(localStorageCookieApiKey);
        const cookiesList = JSON.parse(storedCookies ?? "[]");
        logCookieUpdate(cookiesList);

        setTimeout(() => {
            setSimulateLoadingCookieProvider(false);
        }, 1000);
    }, []);

    const openCookieSettings = React.useCallback(() => {
        const cookies = prompt('Define consented cookies (separated by ","):', consentedCookies.join(",")) ?? "";
        const cookiesList = cookies.split(",").map((cookie) => cookie.trim());
        setConsentedCookies(cookiesList);
        logCookieUpdate(cookiesList);
    }, [consentedCookies, setConsentedCookies]);

    React.useEffect(() => {
        // @ts-expect-error TODO: Can this be fixed?
        window["cometLocalStorageCookieApi"] = {
            consentedCookies,
            openCookieSettings: openCookieSettings,
        };
    }, [consentedCookies, openCookieSettings]);

    return {
        consentedCookies: simulateLoadingCookieProvider ? [] : consentedCookies,
        openCookieSettings,
    };
};

const logCookieUpdate = (cookies: string[]) => {
    // eslint-disable-next-line no-console
    console.info("Consented cookies updated:", cookies);
};
