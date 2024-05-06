"use client";
import * as React from "react";
import { IntlProvider as LibraryIntlProvider } from "react-intl";

type Messages = React.ComponentProps<typeof LibraryIntlProvider>["messages"];

export function IntlProvider({ children, locale, messages }: { children: React.ReactNode; locale: string; messages: Messages }) {
    return (
        <LibraryIntlProvider locale={locale} defaultLocale={locale} messages={messages}>
            {children}
        </LibraryIntlProvider>
    );
}
