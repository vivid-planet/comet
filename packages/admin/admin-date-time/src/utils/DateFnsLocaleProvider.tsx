import { Locale } from "date-fns";
import * as React from "react";

export const DateFnsLocaleContext = React.createContext<Locale | undefined>(undefined);

export const DateFnsLocaleProvider = DateFnsLocaleContext.Provider;

export function useDateFnsLocale() {
    return React.useContext(DateFnsLocaleContext);
}
