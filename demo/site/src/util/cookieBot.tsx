import React from "react";

type WindowWithCookiebot = Window & {
    Cookiebot: {
        consent: Record<string, boolean>;
        renew: () => void;
    };
};

export const isWindowWithCookiebot = (window: Window): window is WindowWithCookiebot => {
    return "Cookiebot" in window;
};

export const openCookiebotCookieSettings = () => {
    if (isWindowWithCookiebot(window)) {
        window.Cookiebot.renew();
    }
};

export const useCookieBotConsent = () => {
    const [consentedCookies, setConsentedCookies] = React.useState<string[]>([]);

    React.useEffect(() => {
        const onCookiesUpdated = () => {
            if (isWindowWithCookiebot(window)) {
                const consentedList = window.Cookiebot.consent;
                setConsentedCookies(Object.keys(consentedList).filter((key) => consentedList[key]));
            }
        };

        window.addEventListener("CookiebotOnAccept", onCookiesUpdated);

        return () => {
            window.removeEventListener("CookiebotOnAccept", onCookiesUpdated);
        };
    }, []);

    return consentedCookies;
};
