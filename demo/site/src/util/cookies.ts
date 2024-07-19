import { useLocalStorageCookieApi, useOneTrustCookieApi as useProductionCookieApi } from "@comet/cms-site";

export const cookieIds = {
    thirdParty: "THIRD_PARTY",
    analytics: "ANALYTICS",
};

export const useCookieApi = process.env.NODE_ENV === "development" ? useLocalStorageCookieApi : useProductionCookieApi;
