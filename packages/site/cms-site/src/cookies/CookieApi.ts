export type CookieApi = () => {
    consentedCookies: string[];
    openCookieSettings: () => void;
};
