"use client";

import { CookieApiProvider, useLocalStorageCookieApi, useOneTrustCookieApi as useProductionCookieApi } from "@comet/site-react";
import { ErrorHandler } from "@src/util/ErrorHandler";
import { IntlProvider } from "@src/util/IntlProvider";
import { type PropsWithChildren } from "react";

export function RootLayoutClient({ children, language, messages }: PropsWithChildren<{ language: string; messages: Record<string, string> }>) {
    return (
        <IntlProvider locale={language} messages={messages}>
            <CookieApiProvider api={process.env.NODE_ENV === "development" ? useLocalStorageCookieApi : useProductionCookieApi}>
                <ErrorHandler>{children}</ErrorHandler>
            </CookieApiProvider>
        </IntlProvider>
    );
}
