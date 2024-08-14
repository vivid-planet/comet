"use client";
import React from "react";

export type CookieApi = {
    initialized: boolean;
    consentedCookies: string[];
    openCookieSettings: () => void;
};

export type CookieApiHook = () => CookieApi;

const CookieApiContext = React.createContext<CookieApi | undefined>(undefined);

type CookieApiProviderProps = React.PropsWithChildren<{
    api: CookieApiHook;
}>;

export const CookieApiProvider = ({ api: useCookieApi, children }: CookieApiProviderProps) => {
    const api = useCookieApi();
    return <CookieApiContext.Provider value={api}>{children}</CookieApiContext.Provider>;
};

export const useCookieApi: CookieApiHook = () => {
    const cookieApi = React.useContext(CookieApiContext);
    if (!cookieApi) {
        throw new Error("Can only be used inside CookieApiProvider.");
    }
    return cookieApi;
};
