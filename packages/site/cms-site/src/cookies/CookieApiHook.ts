export type CookieApiHook = () => {
    consentedCookies: string[];
    openCookieSettings: () => void;
};
