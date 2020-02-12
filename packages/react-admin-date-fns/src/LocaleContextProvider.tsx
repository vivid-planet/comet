import { Locale as DateFnsLocale } from "date-fns";
import { de } from "date-fns/locale";
import * as React from "react";

interface IInternalLocaleContext {
    locale: DateFnsLocale;
    name: string;
}

const InternalLocaleContext = React.createContext<IInternalLocaleContext>({ locale: de, name: "de" });

export const LocaleContextProvider: React.FunctionComponent<IInternalLocaleContext> = ({ locale, name, children }) => {
    return <InternalLocaleContext.Provider value={{ locale, name }}>{children}</InternalLocaleContext.Provider>;
};

export function useLocale(): Locale {
    return React.useContext(InternalLocaleContext).locale;
}

export function useLocaleName(): string {
    return React.useContext(InternalLocaleContext).name;
}
