import React from "react";

import { CookieApiHook } from "./CookieApiHook";

type OneTrustOnConsentChangedEvent = {
    detail: string[];
    [key: string]: unknown;
};

type OnConsentChangedCallback = (event: OneTrustOnConsentChangedEvent) => void;

type ConsentPayloadPurpose = {
    Id: string;
    TransactionType: "NO_CHOICE" | "CONFIRMED" | "OPT_OUT";
};

type ConsentGroup = {
    OptanonGroupId: string;
    PurposeId: string;
    [key: string]: unknown;
};

type DomainData = {
    ConsentIntegrationData: {
        consentPayload: {
            purposes: ConsentPayloadPurpose[];
        };
        [key: string]: unknown;
    };
    Groups: ConsentGroup[];
    [key: string]: unknown;
};

type OneTrust = {
    ToggleInfoDisplay: () => void;
    OnConsentChanged: (callback: OnConsentChangedCallback) => void;
    GetDomainData: () => DomainData;
    [key: string]: unknown;
};

type WindowWithOneTrust = Window & {
    OneTrust: OneTrust;
};

const isWindowWithOneTrust = (window: Window): window is WindowWithOneTrust => {
    return "OneTrust" in window;
};

export const useOneTrustCookieApi: CookieApiHook = () => {
    const [consentedCookies, setConsentedCookies] = React.useState<string[]>([]);

    const startListeningForConsentChanges = React.useCallback((oneTrust: OneTrust) => {
        const initialCookieConsent: string[] = [];
        const domainData = oneTrust.GetDomainData();

        domainData.ConsentIntegrationData.consentPayload.purposes.forEach((purpose) => {
            if (purpose.TransactionType === "CONFIRMED") {
                const targetGroup = domainData.Groups.find(({ PurposeId }) => PurposeId === purpose.Id);

                if (targetGroup) {
                    initialCookieConsent.push(targetGroup.OptanonGroupId);
                }
            }
        });

        setConsentedCookies(initialCookieConsent);

        oneTrust.OnConsentChanged((event) => {
            setConsentedCookies(event.detail);
        });
    }, []);

    React.useEffect(() => {
        const tryToAccessOneTrustInterval = setInterval(() => {
            if (isWindowWithOneTrust(window)) {
                clearInterval(tryToAccessOneTrustInterval);
                startListeningForConsentChanges(window.OneTrust);
            }
        }, 200);

        return () => {
            clearInterval(tryToAccessOneTrustInterval);
        };
    }, [startListeningForConsentChanges]);

    return {
        consentedCookies,
        openCookieSettings: () => {
            if (isWindowWithOneTrust(window)) {
                window.OneTrust.ToggleInfoDisplay();
            }
        },
    };
};
