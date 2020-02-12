import { LocaleContext } from "@vivid-planet/react-admin-date-fns";
import { Locale } from "date-fns";
import { de } from "date-fns/locale";
import * as React from "react";

interface IInternalLocaleContext {
    locale: Locale;
    name: string;
}

const InternalLocaleContext = React.createContext<IInternalLocaleContext>({ locale: de, name: "de" });

export const LocaleContextProvider: React.FunctionComponent<IInternalLocaleContext> = ({ locale, name, children }) => {
    return (
        <InternalLocaleContext.Provider value={{ locale, name }}>
            <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
        </InternalLocaleContext.Provider>
    );
};

export function useLocale(): Locale {
    return React.useContext(InternalLocaleContext).locale;
}

export function useLocaleName(): string {
    return React.useContext(InternalLocaleContext).name;
}
