"use client";
import { defaultLanguage } from "@src/config";
import { IntlProvider as ReactIntlProvider } from "react-intl";

export function IntlProvider({ children }: { children: React.ReactNode }) {
    // TODO get locale from routing information
    return <ReactIntlProvider locale={defaultLanguage} /* messages={messages} */>{children}</ReactIntlProvider>;
}
